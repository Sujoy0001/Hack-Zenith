import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCheckCircle,
  FiTrash2,
  FiMapPin,
  FiUser,
  FiTag,
  FiClock,
  FiImage,
  FiAlertCircle,
  FiRefreshCw,
  FiMessageSquare
} from "react-icons/fi";
import { format } from "date-fns";
import { useUserData } from "../context/useUserData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function RepostPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const user = useUserData();
  const userId = user?.uid;

  // Extract unique post types for filter
  const postTypes = ["all", ...new Set(posts.map(post => post.types))];

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Mark as solved handler
  const markAsSolved = async (postId) => {
    setActionLoading(prev => ({ ...prev, [postId]: "solving" }));
    try {
      await axios.patch(`${API_BASE_URL}/posts/${postId}/mark_solved`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, is_solved: true } : p))
      );
    } catch {
      alert("Failed to mark post as solved");
    } finally {
      setActionLoading(prev => ({ ...prev, [postId]: null }));
    }
  };

  // Delete handler
  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    setActionLoading(prev => ({ ...prev, [postId]: "deleting" }));
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Failed to delete post");
    } finally {
      setActionLoading(prev => ({ ...prev, [postId]: null }));
    }
  };

  // Filter posts based on selected filters
  const filteredPosts = posts.filter(post => {
    const typeMatch = selectedType === "all" || post.types === selectedType;
    const statusMatch = selectedStatus === "all" || 
      (selectedStatus === "solved" && post.is_solved) ||
      (selectedStatus === "unsolved" && !post.is_solved);
    return typeMatch && statusMatch;
  });

  // Stats
  const stats = {
    total: posts.length,
    solved: posts.filter(p => p.is_solved).length,
    unsolved: posts.filter(p => !p.is_solved).length,
  };

  if (loading) {
    return (
      <div className="flex font2 items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 font2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Posts</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full mx-auto p-4 md:p-6 font2">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Posts</h1>
            <p className="text-gray-600">Manage and monitor all community posts</p>
          </div>
          <button
            onClick={fetchPosts}
            className="mt-4 md:mt-0 cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FiMessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Solved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.solved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <FiAlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unsolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unsolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <div className="flex flex-wrap gap-2">
                {postTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${selectedType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 cursor-pointer py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {posts.length === 0 
              ? "No posts have been created yet." 
              : "No posts match your selected filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${post.is_solved ? 'border-green-200' : 'border-gray-200'
                }`}
            >
              {/* Post Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.is_solved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                        }`}>
                        {post.is_solved ? 'Solved' : 'Pending'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {post.types}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 line-clamp-2 mb-4">{post.description}</p>

                {/* Images Preview */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center text-gray-500 mb-2">
                      <FiImage className="mr-2" />
                      <span className="text-sm">{post.images.length} image(s)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {post.images.slice(0, 3).map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`Post image ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                          {i === 2 && post.images.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold">+{post.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Information */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 shrink-0" />
                    <span className="text-sm truncate">
                      {post.location.place}, {post.location.area}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiTag className="mr-2 shrink-0" />
                    <span className="text-sm truncate">
                      {post.tags.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-2 shrink-0" />
                    <span className="text-sm truncate">
                      {post.user.name} ({post.user.email})
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-2 shrink-0" />
                    <span className="text-sm">
                      {format(new Date(post.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end space-x-3">
                  {!post.is_solved && (
                    <button
                      onClick={() => markAsSolved(post.id)}
                      disabled={actionLoading[post.id]}
                      className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {actionLoading[post.id] === "solving" ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="mr-2" />
                          Mark as Solved
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={actionLoading[post.id]}
                    className="px-4 py-2 cursor-pointer bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading[post.id] === "deleting" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Showing {filteredPosts.length} of {posts.length} posts
          {selectedType !== "all" && ` • Filtered by: ${selectedType}`}
          {selectedStatus !== "all" && ` • Status: ${selectedStatus}`}
        </p>
      </div>
    </div>
  );
}