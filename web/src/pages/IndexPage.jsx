import React, { useMemo, useState } from "react";
import posts from "../deta/Posts.json";
import PostCard from "../components/ui/PostCard";
import { MapPin, Calendar } from "lucide-react";

export default function Index() {
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState(["electronics"]);

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

      // Date filter
      if (date && !post.created_at.startsWith(date)) return false;

      // Category filter (tags)
      if (
        categories.length > 0 &&
        !categories.some((cat) => post.tags.includes(cat))
      )
        return false;

      return true;
    });
  }, [type, location, date, categories]);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div className="flex gap-6 p-6">
      
      {/* FILTER PANEL */}
      <aside className="w-72 shrink-0 rounded-2xl border bg-white p-5 space-y-6">
        <h2 className="font-semibold text-lg">Filters</h2>

        {/* Type */}
        <div>
          <p className="text-sm font-medium mb-2">Type</p>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "lost", "found"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 text-sm py-1.5 rounded-md ${
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
          <p className="text-sm font-medium mb-2">Location</p>
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

        {/* Date */}
        <div>
          <p className="text-sm font-medium mb-2">Date Posted</p>
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
            <p className="text-sm font-medium">Categories</p>
            <button
              onClick={() => setCategories(categoryOptions)}
              className="text-xs text-blue-600"
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

        <button
          onClick={() => {}}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl font-medium"
        >
          Apply Filters
        </button>
      </aside>

      {/* POSTS */}
      <main className="flex-1 space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No posts found matching filters.
          </p>
        )}
      </main>
    </div>
  );
}
