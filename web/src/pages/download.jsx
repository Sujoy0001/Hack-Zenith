import React from "react";
import { Download, ShieldCheck, Smartphone } from "lucide-react";

const APK_URL = "/apk/findin.apk"; // <-- change if needed

export default function Downloadpage() {
  return (
    <div className="min-h-full flex items-center justify-center p-18">
      <div className="max-w-xl w-full p-8 text-center font2">

        {/* App Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
          <Smartphone className="text-white" size={42} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Download FindIn App
        </h1>

        <p className="text-gray-600 mb-8">
          Download the official FindIn Android app to report lost items,
          upload found items, and help others in your area.
        </p>

        {/* Download Button */}
        <a
          href={APK_URL}
          download
          className="inline-flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition shadow-lg"
        >
          <Download size={22} />
          Download APK
        </a>

        {/* Info Section */}
        <div className="mt-6 text-md flex gap-6 text-gray-600 justify-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            <span>Safe & Secure APK</span>
          </div>
          <p>Version: 1.0.0</p>
          <p>Minimum Android: 7.0+</p>
        </div>

        {/* Installation Steps */}
        <div className="mt-8 text-left bg-gray-50 rounded-xl p-4 text-lg">
          <h3 className="font-semibold text-gray-700 mb-2">
            How to install
          </h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-1">
            <li>Download the APK file</li>
            <li>Open your Downloads folder</li>
            <li>Allow “Install from unknown sources”</li>
            <li>Tap Install and open FindIn</li>
          </ol>
        </div>

        {/* Footer */}
        <p className="mt-6 text-md text-gray-400">
          © {new Date().getFullYear()} FindIn. All rights reserved.
        </p>
      </div>
    </div>
  );
}
