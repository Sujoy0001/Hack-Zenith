import React, { useState } from "react";
import { ThumbsUp, Share2, MapPin, Eye, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const {
    id,
    user,
    type,
    title,
    location,
    images = [],
    tags = [],
    upvotes = 0,
    created_at,
    is_solved
  } = post;

  const [liked, setLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes);
  const navigate = useNavigate();

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setVoteCount(newLiked ? voteCount + 1 : voteCount - 1);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  };

  const handleView = () => {
    navigate(`/index/post/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border p-4 mb-4">
      
      {/* Header with user info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h3 className="font-medium">{user?.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1" />
              {location?.place}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {is_solved && (
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle size={16} className="mr-1" />
              Solved
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            type === "lost" 
              ? "bg-red-50 text-red-600" 
              : "bg-green-50 text-green-600"
          }`}>
            {type === "lost" ? "Lost" : "Found"}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-semibold text-lg mb-3">{title}</h2>

      {/* Images (simplified) */}
      {images.length > 0 && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.slice(0, 3).map((img, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-32">
                <img
                  src={img}
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              liked 
                ? "bg-red-50 text-red-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ThumbsUp size={16} />
            <span className="text-sm font-medium">{voteCount}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Share2 size={16} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            {new Date(created_at).toLocaleDateString()}
          </span>
          
          <button
            onClick={handleView}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}