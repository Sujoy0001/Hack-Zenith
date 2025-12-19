import React, { useCallback, useMemo, useRef, useState } from "react";
import { ThumbsUp, Share2, MapPin, CheckCircle } from "lucide-react";
import CountButton from "./CountButton";

export default function SolvedCard({ post }) {
  const {
    id,
    user,
    location,
    text,
    images = [],
    tags = [],
    upvotes = 0,
    isSolved = false, // <-- backend value
  } = post;

  const [liked, setLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes);
  const [solved, setSolved] = useState(isSolved);
  const scrollerRef = useRef(null);

  const shareUrl = useMemo(() => {
    return id ? `${window.location.origin}/post/${id}` : window.location.href;
  }, [id]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Campus Issue",
          text,
          url: shareUrl,
        });
      } else {
        throw new Error();
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      alert("Post link copied!");
    }
  }, [shareUrl, text]);

  const handleLike = useCallback(() => {
    setLiked((prev) => !prev);
    setVoteCount((prev) => (liked ? prev - 1 : prev + 1));
  }, [liked]);

  const handleSolve = useCallback(() => {
    setSolved(true);

    // 🔗 Backend call example
    // await api.patch(`/posts/${id}/solve`)
  }, [id]);

  return (
    <article
      className={`rounded-2xl transition-all overflow-hidden max-w-2xl w-full mx-auto
        ${solved ? "border-2 border-green-500 bg-green-50/40" : "hover:shadow-lg"}
      `}
    >
      {/* Header */}
      <header className="flex items-center font2 gap-4 p-5">
        {solved && (
          <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
            <CheckCircle size={16} />
            Solved
          </span>
        )}
      </header>

      <div className="px-5 pb-4 font2">
        <p className="whitespace-pre-wrap">{text}</p>
      </div>

      {images.length > 0 && (
        <div
          ref={scrollerRef}
          className="flex gap-3 px-5 pb-4 overflow-x-auto scroll-smooth"
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="rounded-xl max-w-md object-cover"
            />
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="px-5 pb-4 font2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="flex items-center justify-between px-5 py-3 border-t">
        <div className="flex gap-3">
          <CountButton
            icon={ThumbsUp}
            text="Upvote"
            count={voteCount}
            active={liked}
            onClick={handleLike}
          />
          <CountButton icon={Share2} text="Share" onClick={handleShare} />
        </div>

        {!solved && (
          <button
            onClick={handleSolve}
            className="flex items-center font2 gap-2 px-4 py-3 rounded-md cursor-pointer
              bg-green-800 text-white text-sm font-semibold
              hover:bg-green-700 transition"
          >
            <CheckCircle size={16} />
            Mark as Solved
          </button>
        )}
      </footer>
    </article>
  );
}
