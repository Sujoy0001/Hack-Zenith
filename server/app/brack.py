from db.mongodb import posts_collection, found_collection, lost_collection
from main import monitor_found_collection

async def break_posts_collection():
    """Process posts in batches for better performance."""
    batch_size = 50
    lost_to_insert = []
    found_to_insert = []
    
    async for post in posts_collection.find({}):
        post_type = post.get("types", "").lower()
        post_data = post.copy()
        post_data.pop("created_at", None)
        post_data.pop("images", None)
        post_data.get("user", {}).pop("avatar", None)
        
        # Process in batches
        if len(lost_to_insert) >= batch_size:
            if lost_to_insert:
                result = await lost_collection.insert_many(lost_to_insert, ordered=False)
                print(f"Inserted {len(result.inserted_ids)} lost posts")
                lost_to_insert = []
        
        if len(found_to_insert) >= batch_size:
            if found_to_insert:
                result = await found_collection.insert_many(found_to_insert, ordered=False)
                print(f"Inserted {len(result.inserted_ids)} found posts")
                found_to_insert = []
    
    # Process remaining documents
    if lost_to_insert:
        result = await lost_collection.insert_many(lost_to_insert, ordered=False)
        print(f"Inserted final batch of {len(result.inserted_ids)} lost posts")
    
    if found_to_insert:
        result = await found_collection.insert_many(found_to_insert, ordered=False)
        await monitor_found_collection()
        print(f"Inserted final batch of {len(result.inserted_ids)} found posts")
    
    return {"status": "success", "message": "Batch processing completed"}