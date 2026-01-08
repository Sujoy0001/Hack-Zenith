from db.mongodb import posts_collection, found_collection, lost_collection
from .ai import match_lost_found
import asyncio

BATCH_SIZE = 50
is_running = False


async def break_posts_collection():
    """
    Process posts and separate them into lost and found collections.
    """
    lost_to_insert = []
    found_to_insert = []

    async for post in posts_collection.find({}):
        post_type = post.get("types", "").lower()

        post_data = post.copy()
        post_data.pop("_id", None)
        post_data.pop("created_at", None)
        post_data.pop("images", None)
        post_data.get("user", {}).pop("avatar", None)

        if post_type == "lost":
            lost_to_insert.append(post_data)
        elif post_type == "found":
            found_to_insert.append(post_data)

        if len(lost_to_insert) >= BATCH_SIZE:
            if post in lost_collection.find({}):
                continue
            await lost_collection.insert_many(lost_to_insert, ordered=False)
            lost_to_insert.clear()

        if len(found_to_insert) >= BATCH_SIZE:
            if post in found_collection.find({}):
                continue
            await found_collection.insert_many(found_to_insert, ordered=False)
            found_to_insert.clear()

    if lost_to_insert:
        await lost_collection.insert_many(lost_to_insert, ordered=False)

    if found_to_insert:
        await found_collection.insert_many(found_to_insert, ordered=False)

    return {"status": "success", "message": "Batch processing completed"}


async def monitor_found_collection():
    
    global is_running

    previous_count = await found_collection.count_documents({})

    old_count = 0

    if old_count < previous_count:
        await match_lost_found()
        old_count = previous_count
    
    else:
        print("No new found posts. Skipping matching.")
