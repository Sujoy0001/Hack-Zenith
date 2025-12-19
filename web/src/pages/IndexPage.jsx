import React from "react";
import posts from "../deta/Posts.json";
import PostCard from "../components/ui/PostCard";

export default function Index() {
    return (
        <>
            <div className="p-6 gap-4 flex flex-col">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </>
    )
}