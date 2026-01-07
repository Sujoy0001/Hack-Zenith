from db.mongodb import lost_collection, found_collection, matches_collection
import aiohttp
from bson import ObjectId
from config.gemini import GEMINI_API_URL
import google.generativeai as genai
import json
import re

BATCH_SIZE = 5

# -----------------------------
# Safety check for Gemini URL
# -----------------------------
# if not isinstance(GEMINI_API_URL, str) or not GEMINI_API_URL.startswith("http"):
#     raise RuntimeError(
#         "GEMINI_API_URL is not set correctly. "
#         "Ensure it is a valid string URL in your environment variables."
#     )


# -----------------------------
# Helpers
# -----------------------------
def convert_objectid(obj):
    if isinstance(obj, list):
        return [convert_objectid(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj


# -----------------------------
# Fetch posts
# -----------------------------
async def fetch_all_lost_posts():
    return [doc async for doc in lost_collection.find({})]


async def fetch_all_found_posts():
    return [doc async for doc in found_collection.find({})]


# -----------------------------
# Gemini call
# -----------------------------
# genai.configure(api_key=GEMINI_API_URL)



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

        # ✅ Extract text
        raw_text = response.text

        # ✅ Remove markdown
        clean_text = re.sub(r"```json|```", "", raw_text).strip()

        # ✅ Parse JSON
        matches_data = json.loads(clean_text)

        return matches_data

    except Exception as e:
        print(f"Gemini SDK error: {e}")
        return None


# -----------------------------
# Main matcher
# -----------------------------
async def match_lost_found():
    lost_posts = await fetch_all_lost_posts()
    found_posts = await fetch_all_found_posts()

    print(f"Matching {len(lost_posts)} lost posts with {len(found_posts)} found posts")

    for lost_post in lost_posts:
        lost_id = lost_post["_id"]
        if lost_id in (await matches_collection.distinct("lost_post_id")):
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

            await matches_collection.insert_one({
                "lost_post_id": payload["lost_post"]["_id"],
                "matches": gemini_result["matches"]
            })

        else:
            print(f"No matches found for lost post {lost_id}")
