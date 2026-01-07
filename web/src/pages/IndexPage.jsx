import React, { useMemo, useState, useEffect } from "react";
import PostCard from "../components/ui/PostCard";
import { MapPin, Calendar, RefreshCw } from "lucide-react";
import { connectBackend } from "../api/connect";

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [types, setTypes] = useState("all");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("newest");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  connectBackend();

  const categoryOptions = [
    "electronics",
    "clothing",
    "wallet",
    "bag",
    "pets",
    "keys",
    "documents",
    "jewelry",
  ];

  /* ---------------- FETCH POSTS ---------------- */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/posts/get_all`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [API_BASE_URL]);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      /* TYPE FILTER - Fixed to use correct field name */
      if (types !== "all" && post.types?.toLowerCase() !== types) {
        return false;
      }

      /* LOCATION FILTER */
      if (
        location &&
        !post.location?.place
          ?.toLowerCase()
          .includes(location.toLowerCase())
      ) {
        return false;
      }

      /* DATE FILTER */
      if (date && !post.created_at?.startsWith(date)) {
        return false;
      }

      /* CATEGORY (TAGS) FILTER */
      if (
        categories.length > 0 &&
        !categories.some((cat) =>
          post.tags?.map((t) => t.toLowerCase()).includes(cat)
        )
      ) {
        return false;
      }

      return true;
    });

    /* SORT */
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, types, location, date, categories, sort]);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setTypes("all");
    setLocation("");
    setDate("");
    setCategories([]);
    setSort("newest");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col md:flex-row font2">
      {/* FILTER SIDEBAR */}
      <aside className="w-80 h-screen fixed bg-white border-gray-300 border-r p-5 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 disabled:opacity-50"
            title="Refresh posts"
          >
            <RefreshCw
              size={20}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* TYPE */}
        <div>
          <p className="font-medium mb-2">Type</p>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "lost", "found"].map((t) => (
              <button
                key={t}
                onClick={() => setTypes(t)}
                className={`flex-1 py-1.5 rounded-md text-sm capitalize ${
                  types === t
                    ? "bg-white cursor-pointer shadow font-semibold"
                    : "text-gray-500"
                }`}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <p className="font-medium mb-2">Location</p>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or Place"
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* DATE */}
        <div>
          <p className="font-medium mb-2">Date Posted</p>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="font-medium">Categories</p>
            <button
              onClick={() => setCategories(categoryOptions)}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
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
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* SORT */}
        <div>
          <p className="font-medium mb-2">Sort by</p>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["newest", "oldest"].map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`flex-1 py-1.5 rounded-md text-sm ${
                  sort === s
                    ? "bg-white shadow font-semibold cursor-pointer"
                    : "text-gray-500"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={resetFilters}
            className="w-full cursor-pointer bg-gray-200 text-gray-800 py-3 rounded-md font-medium hover:bg-gray-300"
          >
            Clear All Filters
          </button>

          <button
            onClick={() => {}}
            className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* POSTS */}
      <main className="ml-80 w-full p-6 flex flex-col items-center gap-6">
        {loading ? (
          <p className="text-gray-500 mt-20">Loading posts...</p>
        ) : error ? (
          <p className="text-red-500 mt-20">{error}</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-500 mt-20">
            No posts found matching the selected filters.
          </p>
        )}
      </main>
    </div>
  );
}