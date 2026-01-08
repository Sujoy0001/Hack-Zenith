import os
import re
import json
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from db.mongodb import lost_collection, found_collection, matches_collection, notifications_collection
from config.gemini import GEMINI_API_URL

BATCH_SIZE = 5

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_EMAIL"),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD"),
    MAIL_FROM=os.getenv("SMTP_EMAIL"),
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=465,
    MAIL_STARTTLS=False,   # REQUIRED (new)
    MAIL_SSL_TLS=True,     # REQUIRED (new)
    USE_CREDENTIALS=True,
)

mail_client = FastMail(conf)

# Helper: Convert ObjectId to string recursively
def convert_objectid(obj):
    if isinstance(obj, list):
        return [convert_objectid(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Fetch posts from DB
async def fetch_all_lost_posts():
    return [doc async for doc in lost_collection.find({})]

async def fetch_all_found_posts():
    return [doc async for doc in found_collection.find({})]

# Call Google Gemini API to get matches
async def send_to_gemini(payload: dict):
    try:
        genai.configure(api_key=GEMINI_API_URL)
        model = genai.GenerativeModel("gemini-2.5-flash")

        json_template = """
        {
          "matches": [
            {
              "found_post_id": "string",
              "user_email": "string",
              "score": 0.85
            }
          ]
        }
        """

        prompt = f"""
            You are a lost-and-found matching AI.

            Compare the LOST post with FOUND posts and return matches in JSON.

            LOST POST:
            {json.dumps(payload['lost_post'], indent=2)}

            FOUND POSTS:
            {json.dumps(payload['found_posts'], indent=2)}

            Return ONLY valid JSON in this format:
            {json_template}
        """

        response = model.generate_content(prompt)

        raw_text = response.text
        clean_text = re.sub(r"```json|```", "", raw_text).strip()

        matches_data = json.loads(clean_text)

        return matches_data

    except Exception as e:
        print(f"Gemini SDK error: {e}")
        return None

# Send notification email and save notification to DB
async def send_email_notification(user_email: str, payload: dict):
    # Store notification in DB
    await notifications_collection.insert_one({
        "user_id": user_email,
        "title": payload["title"],
        "message": payload["message"],
        "type": payload.get("type", "notification"),
        "post_link": payload.get("post_link"),
        "read": False,
        "created_at": datetime.utcnow(),
    })

    # Prepare email
    message = MessageSchema(
        subject=payload["title"],
        recipients=[user_email],
        body=f"{payload['message']}\n\nLink: {payload.get('post_link', 'N/A')}",
        subtype="plain"
    )

    try:
        await mail_client.send_message(message)
    except Exception as e:
        print(f"Failed to send email to {user_email}: {e}")

# Main function to perform lost-found matching and notify users
async def match_lost_found():
    lost_posts = await fetch_all_lost_posts()
    found_posts = await fetch_all_found_posts()

    print(f"Matching {len(lost_posts)} lost posts with {len(found_posts)} found posts")

    for lost_post in lost_posts:
        lost_id = lost_post["_id"]

        # Skip already matched lost posts
        existing_matches = await matches_collection.distinct("lost_post_id")
        if lost_id in existing_matches:
            print(f"Skipping already matched lost post: {lost_id}")
            continue

        print(f"\nChecking lost post: {lost_id}")

        for i in range(0, len(found_posts), BATCH_SIZE):
            batch = found_posts[i : i + BATCH_SIZE]

            payload = {
                "lost_post": convert_objectid(lost_post),
                "found_posts": convert_objectid(batch),
            }

            gemini_result = await send_to_gemini(payload)

            if not gemini_result:
                continue

            # Store matches in DB
            await matches_collection.insert_one({
                "lost_post_id": payload["lost_post"]["_id"],
                "matches": gemini_result["matches"]
            })

            # Notify users by email
            for match in gemini_result["matches"]:
                if match.get("score", 0) <= 0.60:
                    continue
                else:
                    user_email = match["user_email"]
                    message = f"Found a match for your lost post: {lost_post['title']}"
                    await send_email_notification(user_email, {
                        "title": "Match Found!",
                        "message": message,
                        "post_link": f"https://hack-zenith.vercel.app/index/post/{match['found_post_id']}"
                    })

        else:
            print(f"No matches found for lost post {lost_id}")
