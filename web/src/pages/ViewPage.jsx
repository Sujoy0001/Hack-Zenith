import React from "react";
import { useParams } from "react-router-dom";
import reports from "../deta/Posts.json";
import { MapPin, Contact } from "lucide-react";
import Button from "../components/ui/Button";


export default function ViewPage() {
  const { id } = useParams();

  const post = reports.find((p) => String(p.id) === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Post not found
      </div>
    );
  }

  return (
    <main className="min-h-full py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* User Info */}
        <div className="flex items-center font2 gap-4 mb-6">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-14 h-14 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{post.user.name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              {post.user.location}
            </p>
          </div>
        </div>

        {/* Post Text */}
        <p className="text-gray-800 font2 leading-relaxed mb-6">
          {post.text}
        </p>

        {/* Images */}
        {post.images?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {post.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Post ${i}`}
                className="rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex font2 flex-wrap gap-2 mb-8">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Contact Section */}
        <div className="border-t pt-6 flex font2 flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-gray-500">
            Need more details? Contact the reporter.
          </p>
          <div className="flex w-1/2">
            <Button text="Contact" variant="dark" icon={Contact} />
          </div>
        </div>

      </div>
    </main>
  );
}
