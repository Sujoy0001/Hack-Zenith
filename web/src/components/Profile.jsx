import React, { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";

export default function Profile({
  username,
  email,
  image,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative border border-gray-300 rounded-4xl px-4 py-1.5" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="font2">{username}</span>
        <img
          src={image}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border border-gray-300"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute
          right-0
          mt-3
          w-auto
          min-w-70
          bg-white
          border
          rounded-xl
          border-gray-300
          shadow-lg
          z-50
        ">
          <div className="p-4 border-b flex items-center gap-3 font2">
            <div>
              <p className="text-sm font-semibold">Username : {username}</p>
              <p className="text-sm mt-2 font-semibold">Email : {email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="
              w-full
              flex
              items-center
              gap-2
              px-4
              py-3
              text-sm
              font-semibold
              text-red-600
              hover:bg-red-100
              rounded-b-xl
              cursor-pointer
              font2
            "
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
