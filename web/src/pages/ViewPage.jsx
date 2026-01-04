import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import reports from "../deta/Posts.json";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Contact,
  ArrowLeft,
  Share2,
  MessageCircle
} from "lucide-react";
import Button from "../components/ui/Button";

export default function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = reports.find((p) => String(p.id) === id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      text: post?.description.substring(0, 100) + "...",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Post shared successfully");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy:", err);
      });
    }
  };

  const handleMessage = () => {
    // Add your message logic here
    console.log("Message user:", post?.user?.name);
    // Example: window.open(`mailto:${post.user?.email}?subject=Regarding: ${post.title}`, '_blank');
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Button 
            text="Go Back" 
            variant="dark" 
            onClick={() => navigate(-1)}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full font2">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center cursor-pointer gap-2 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow transition-all duration-200 text-gray-700 hover:text-gray-900 border border-gray-200"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back to Posts</span>
              </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* User Header */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <img
                    src={post.user?.avatar}
                    alt={post.user?.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{post.user?.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <MapPin size={16} />
                        {post.location?.place}, {post.location?.area}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Clock size={16} />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full font-semibold ${
                    post.type === "found"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    {post.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {post.description}
                  </p>
                </div>

                {/* Images */}
                {post.images?.length > 0 && (
                  <div className="mb-8">
                    <div className={`grid gap-4 ${
                      post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                    }`}>
                      {post.images.map((img, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={img}
                            alt={`Post ${i + 1}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full font-medium shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Status Card */}
              <div className={`rounded-2xl shadow-xl overflow-hidden border ${
                post.is_solved 
                  ? 'bg-linear-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-linear-to-br from-yellow-50 to-amber-50 border-yellow-200'
              }`}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full ${
                      post.is_solved ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {post.is_solved ? (
                        <CheckCircle size={24} className="text-green-600" />
                      ) : (
                        <AlertCircle size={24} className="text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {post.is_solved ? 'Case Solved' : 'Case Active'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {post.is_solved 
                          ? 'Resolved successfully' 
                          : 'Needs attention'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Actions</h3>
                  <p className="text-gray-600 text-sm mt-1">What would you like to do?</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Message User Button */}
                  <button 
                    onClick={handleMessage}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    <MessageCircle size={20} />
                    Message User
                  </button>
                  
                  {/* Share Button */}
                  <button 
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <Share2 size={20} />
                    Share Post
                  </button>
                </div>
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                <p className="text-blue-600 text-sm">
                  Use the "Message User" button to contact the reporter directly. 
                  Share this post to help spread awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}