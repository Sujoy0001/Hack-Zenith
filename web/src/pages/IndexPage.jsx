import React, { useMemo, useState, useEffect } from "react";
import PostCard from "../components/ui/PostCard";
import { MapPin, Calendar } from "lucide-react";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [type, setType] = useState("all");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Categories derived from your JSON tags
  const categoryOptions = [
    "electronics",
    "clothing",
    "wallet",
    "bag",
    "pets",
    "keys",
    "documents",
    "jewelry"
  ];

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/posts/get_all`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Type filter
      if (type !== "all" && post.type !== type) return false;

      // Location filter
      if (
        location &&
        !post.location?.place
          ?.toLowerCase()
          .includes(location.toLowerCase())
      )
        return false;

      // Date filter (assuming created_at is ISO string)
      if (date && !post.created_at.startsWith(date)) return false;

      // Category filter (tags)
      if (
        categories.length > 0 &&
        !categories.some((cat) => post.tags.includes(cat))
      )
        return false;

      return true;
    });
  }, [posts, type, location, date, categories]);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div className="flex flex-col shrink-0 md:flex-row">
      {/* FILTER PANEL */}
      <aside className="w-82 font2 h-screen fixed flex flex-col bg-white shrink-0 border-r border-gray-300 p-5 space-y-6">
        <h2 className="font-semibold text-2xl">Filters</h2>

        {/* Type */}
        <div>
          <p className="text-md font-medium mb-2">Type</p>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "lost", "found"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 text-sm py-1.5 rounded-md cursor-pointer ${
                  type === t
                    ? "bg-white shadow font-semibold"
                    : "text-gray-500"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-md font-medium mb-2">Location</p>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or Place"
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
            />
          </div>
        </div>

        {/* Date Posted */}
        <div>
          <p className="text-md font-medium mb-2">Date Posted</p>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-md font-medium">Categories</p>
            <button
              onClick={() => setCategories(categoryOptions)}
              className="text-xs text-blue-600 cursor-pointer hover:underline"
            >
              Select All
            </button>
          </div>

          <div className="space-y-2">
            {categoryOptions.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat.replace("-", " ").toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Apply button (optional) */}
        <button
          onClick={() => {}}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-medium cursor-pointer hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </aside>

      {/* POSTS DISPLAY */}
      <main className="flex flex-col font2 w-full ml-80 space-y-4 overflow-y-auto justify-center items-center mx-auto p-6 mb-20">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No posts found matching filters.
          </p>
        )}
      </main>
    </div>
  );
}
