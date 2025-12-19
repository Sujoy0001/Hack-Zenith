import React from "react";

const CountButton = ({ icon: Icon, count, text, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center cursor-pointer font2 gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
    >
      <Icon
        size={20}
        className="text-gray-600 group-hover:text-indigo-600 transition-colors"
      />
      {text && (<span className="text-sm font-medium text-gray-700">{text}</span>)}

      <span className="text-sm font-medium text-red-800">
        {count !== undefined ? count : label}
      </span>
    </button>
  );
};

export default CountButton;