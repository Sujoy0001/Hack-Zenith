import { useEffect, useState } from "react";

export default function ChangeText({
  texts = [],
  interval = 2000,
}) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (!texts.length) return;

    const timer = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setAnimate(true);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <div className="w-full mb-4 flex justify-center">
      <div className="px-4 py-2 rounded-full font2 bg-white border border-gray-200 shadow text-lg font-medium min-h-4 flex items-center text-center text-zinc-800 justify-center">
        <div className="h-4 w-4 bg-red-800 rounded-full mr-2 shadow-md"></div>
        <span
          className={`transition-all duration-300 ${
            animate
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {texts[index]}
        </span>
      </div>
    </div>
  );
}
