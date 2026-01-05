import React, { useEffect, useRef, useState } from "react";
import { LogOut, User } from "lucide-react"; // ← Add User here
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase"; // ← Make sure this path is correct!
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-1.5">
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || "User";
  const hasPhoto = user.photoURL && user.photoURL.trim() !== "";

  return (
    <div
      className="relative border border-gray-300 rounded-4xl px-4 py-1.5"
      ref={dropdownRef}
    >
      {/* Profile Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer select-none"
        aria-label="User menu"
      >
        <span className="font2 text-sm md:text-base">{displayName}</span>

        {/* Avatar: Image or Default Icon */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
          {hasPhoto ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <User
            size={20}
            className={`text-gray-500 ${hasPhoto ? "hidden" : "flex"}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white border rounded-xl border-gray-300 shadow-lg z-50 overflow-hidden">
          {/* User Info Section */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* Larger Avatar in Dropdown */}
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center shrink-0">
                {hasPhoto ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <User
                  size={32}
                  className={`text-gray-500 ${hasPhoto ? "hidden" : "flex"}`}
                />
              </div>

              <div className="font2">
                <p className="font-semibold text-gray-900">{displayName}</p>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-0">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/index/profile");
              }}
              className="w-full cursor-pointer text-left px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition font2"
            >
              View Profile
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-semibold text-red-600 hover:bg-red-50 transition font2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}