import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center p-24 font2">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-linear-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center shadow-sm border border-red-200">
              <AlertCircle className="text-red-500" size={48} />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>

        {/* Action Button */}
        <Link
          to="/index"
          className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          <Home size={20} />
          <span>Go Back Home</span>
        </Link>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}