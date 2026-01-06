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

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
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
    }

    fetchPosts();
  }, [API_BASE_URL]);

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      /* TYPE FILTER */
      if (
        type !== "all" &&
        post.type?.toLowerCase() !== type
      ) {
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
      if (
        date &&
        !post.created_at?.startsWith(date)
      ) {
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
  }, [posts, type, location, date, categories]);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col md:flex-row">
      {/* FILTER SIDEBAR */}
      <aside className="w-80 h-screen fixed bg-white border-r p-5 space-y-6">
        <h2 className="text-2xl font-semibold">Filters</h2>

        {/* TYPE */}
        <div>
          <p className="font-medium mb-2">Type</p>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "lost", "found"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-md text-sm ${
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
              className="text-xs text-blue-600 hover:underline"
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
                {cat.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => {}}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </aside>

      {/* POSTS */}
      <main className="ml-80 w-full p-6 flex flex-col items-center gap-4">
        {loading ? (
          <p className="text-gray-500 mt-10">Loading posts...</p>
        ) : error ? (
          <p className="text-red-500 mt-10">{error}</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-500 mt-10">
            No posts found matching filters.
          </p>
        )}
      </main>
    </div>
  );
}
