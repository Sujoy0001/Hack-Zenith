from db.mongodb import posts_collection, found_collection, lost_collection
from .ai import match_lost_found
import asyncio

BATCH_SIZE = 50
is_running = False

async def insert_without_duplicates(collection, documents):
    ids = [doc["id"] for doc in documents]

    existing = await collection.find(
        {"id": {"$in": ids}},
        {"id": 1}
    ).to_list(length=None)

    existing_ids = {doc["id"] for doc in existing}

    new_docs = [doc for doc in documents if doc["id"] not in existing_ids]

    if new_docs:
        await collection.insert_many(new_docs, ordered=False)


async def break_posts_collection():
    """
    Process posts and separate them into lost and found collections
    without inserting duplicates.
    """

    lost_batch = []
    found_batch = []

    async for post in posts_collection.find({}):
        post_type = post.get("types", "").lower()

        post_data = post.copy()
        post_data.pop("created_at", None)
        post_data.pop("images", None)

        if isinstance(post_data.get("user"), dict):
            post_data["user"].pop("avatar", None)

        if post_type == "lost":
            lost_batch.append(post_data)

        elif post_type == "found":
            found_batch.append(post_data)

        if len(lost_batch) >= BATCH_SIZE:
            await insert_without_duplicates(lost_collection, lost_batch)
            lost_batch.clear()

        if len(found_batch) >= BATCH_SIZE:
            await insert_without_duplicates(found_collection, found_batch)
            found_batch.clear()

    if lost_batch:
        await insert_without_duplicates(lost_collection, lost_batch)

    if found_batch:
        await insert_without_duplicates(found_collection, found_batch)

    return {
        "status": "success",
        "message": "Batch processing completed without duplicates"
    }


async def monitor_found_collection():
    
    global is_running

    previous_count = await found_collection.count_documents({})

    old_count = 0

    if old_count < previous_count:
        await match_lost_found()
        old_count = previous_count
    
    else:
        print("No new found posts. Skipping matching.")
