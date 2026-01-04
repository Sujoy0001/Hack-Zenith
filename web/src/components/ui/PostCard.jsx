import React, { useState } from "react";
import {
  ThumbsUp,
  Share2,
  MapPin,
  Eye,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  Tag,
  AlertCircle
} from "lucide-react";
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
    is_solved,
    description,
    urgency
  } = post;

  const [liked, setLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setVoteCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/post/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: `${title} - Lost & Found`, 
          text: description?.substring(0, 100) + '...',
          url: shareUrl 
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <article 
      className="group w-full max-w-3xl bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 space-y-5 hover:border-gray-300 active:scale-[0.998]"
    >
      
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.name}
              alt={user?.name || "User"}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 ring-blue-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.name;
              }}
            />
            {user?.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <CheckCircle size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{user?.name || "Anonymous"}</h3>
              {urgency === "high" && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  <AlertCircle size={10} />
                  Urgent
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1.5" />
              <span className="truncate max-w-45">{location?.place || "Location not specified"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {is_solved && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} />
              Solved
            </span>
          )}
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
              type === "lost"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-green-50 text-green-600 border border-green-100"
            }`}
          >
            {type === "lost" ? "Lost Item" : "Found Item"}
          </span>
        </div>
      </header>

      {/* Title & Description */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative shrink-0">
                <img
                  src={img}
                  alt={`Preview ${i + 1}`}
                  className="h-72 w-auto rounded-lg object-cover shadow-sm hover:shadow-md transition"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = `
                      <div class="h-48 w-64 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={32} class="text-gray-400" />
                      </div>
                    `;
                  }}
                />
                {i === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1">
              {images.slice(0, 4).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/80"></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 6).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
          {tags.length > 6 && (
            <span className="text-xs text-gray-500 px-2 py-1.5">
              +{tags.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Footer - Simplified */}
      <footer className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={16} />
            {formatTime(created_at)}
          </span>
          
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all ${
              liked
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <ThumbsUp size={18} className={liked ? "fill-red-600" : ""} />
            <span className="font-medium">{voteCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition border border-gray-200"
          >
            <Share2 size={18} />
            <span className="font-medium">Share</span>
          </button>

          <button
            onClick={() => navigate(`/index/post/${id}`)}
            className="flex items-center cursor-pointer gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <Eye size={18} />
            View Details
          </button>
        </div>
      </footer>
    </article>
  );
}