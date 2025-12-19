import React from "react";

export default function Button({
  onClick,
  text,
  icon: Icon,
  variant = "default",
  iconPosition = "left",
}) {
  const baseClasses = "flex font2 items-center w-auto gap-2 px-6 py-3 transition text-md font-medium cursor-pointer";

  const variants = {
    default: "bg-white text-black border border-gray-300 hover:bg-gray-100",
    dark: "bg-zinc-900 text-white hover:bg-black rounded-lg shadow-md w-full items-center justify-center",
    delete: "bg-red-500/80 border border-red-500 hover:bg-red-500",
    free: "border-none text-zinc-800 hover:text-red-800 bg-transparent w-full",
    roundb: "bg-zinc-900 text-white rounded-full border border-black hover:bg-black shadow-lg",
    round: "bg-white text-zinc-900 border border-gray-300 rounded-full hover:bg-gray-100 shadow",
  };

  const content = iconPosition === "right" ? (
    <>
      <span>{text}</span>
      {Icon && <Icon className="w-5 h-5" />}
    </>
  ) : (
    <>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{text}</span>
    </>
  );

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.default}`}
    >
      {content}
    </button>
  );
}