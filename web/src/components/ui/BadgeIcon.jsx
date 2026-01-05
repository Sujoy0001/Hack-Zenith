import React from "react";

export default function BadgeIcon({
  icon: Icon,
  count = 0,
  size = 22,
  className = "",
  onClick,
}) {
  const showBadge = count > 0;
  const badgeText = count > 9 ? "10+" : count;

  return (
    <div
      className={`flex gap-2 items-center cursor-pointer border border-gray-300 rounded-4xl py-2 px-3 transition ${className}`}
      onClick={onClick}
    >
      <Icon size={size} />

      {showBadge && (
        <span
          className="
          px-2
          py-1
          text-xs
          font2
            flex
            items-center
            justify-center
            rounded-full
            bg-red-600
            text-white
          "
        >
          {badgeText}
        </span>
      )}
    </div>
  );
}
