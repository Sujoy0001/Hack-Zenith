import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-full flex items-center justify-center px-6 font2">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Oops!
          </h1>
          <p className="text-gray-500 mb-6">
            We couldn’t find the page you’re looking for.
          </p>

          <Link
            to="/index"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Go Home
          </Link>
        </div>
    </div>
  );
}
