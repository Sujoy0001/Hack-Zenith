import React, { useCallback, useMemo, useRef, useState } from "react";
import { ThumbsUp, Share2, MapPin } from "lucide-react";
import CountButton from "./CountButton";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";


export default function PostCard({ post }) {
  const {
    id,
    user,
    location,
    text,
    images = [],
    tags = [],
    upvotes = 0,
  } = post;

  const [liked, setLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollerRef = useRef(null);
  const navigate = useNavigate();


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
        throw new Error("Web Share API not supported");
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      alert("Post link copied to clipboard!");
    }
  }, [shareUrl, text]);

  const handleLike = useCallback(() => {
    setLiked((prev) => !prev);
    setVoteCount((prev) => (liked ? prev - 1 : prev + 1));
  }, [liked]);

  const scrollToSlide = (index) => {
    if (!scrollerRef.current) return;
    const scrollAmount = index * scrollerRef.current.children[0].offsetWidth;
    scrollerRef.current.scrollTo({
      left: scrollAmount + index * 12, 
      behavior: "smooth",
    });
    setCurrentSlide(index);
  };

  const scrollBy = (direction) => {
    if (!scrollerRef.current) return;
    const slideWidth = scrollerRef.current.children[0].offsetWidth + 12;
    scrollerRef.current.scrollBy({
      left: direction * slideWidth,
      behavior: "smooth",
    });
  };

  return (
    <article className=" rounded-2xl  hover:shadow-lg transition-all duration-300 overflow-hidden max-w-2xl w-full mx-auto">
      <header className="flex items-center font2 gap-4 p-5">
        <img
          src={user?.avatar || "https://via.placeholder.com/48"}
          alt={`${user?.name || "User"}'s avatar`}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{user?.name || "Anonymous"}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={14} />{user?.location}</p>
        </div>
      </header>

      <div className="px-5 pb-4">
        <p className="text-gray-800 font2 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>

      {images.length > 0 && (
        <section className="relative px-5 pb-4">
          <div className="relative group">
            <div
              ref={scrollerRef}
              className="flex overflow-x-auto gap-3 scrollbar-hide snap-x snap-mandatory scroll-smooth"
              onScroll={() => {
              }}
            >
              {images.slice(0, 5).map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full max-w-md snap-center"
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-4/3">
                    <img
                      src={img}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {images.length === 5 && index === 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                        <span className="text-white text-3xl font-bold">+1</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => scrollBy(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 cursor-pointer top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollBy(1)}
                  aria-label="Next image"
                  className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {tags.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-indigo-50 text-red-800 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <div className="flex gap-3">
          <CountButton
            icon={ThumbsUp}
            text="Upvote"
            count={voteCount}
            active={liked}
            onClick={handleLike}
          />
          <CountButton
            icon={Share2}
            label="Share"
            onClick={handleShare}
          />
        </div>
        <button
          onClick={() => navigate(`/index/post/${id}`)}
          className="flex items-center cursor-pointer gap-2 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
          >
          <Eye size={16} />
          View Post
        </button>

      </footer>
    </article>
  );
}