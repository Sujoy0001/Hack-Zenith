import React from "react";
import { useEffect, useState } from "react";
import profileData from "../deta/profileData";

export default function ProfilePage() {
  const [profile, setProfile] = useState(profileData);

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved successfully");
  };

  return (
    <div className="min-h-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 font2">
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and profile picture</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image */}
          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 font2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h2>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                  />
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <label className="w-full">
                  <div className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg border border-gray-300 transition duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    Upload New Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </label>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Recommended: Square JPG, PNG at least 400px
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl p-6 font2">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setProfile(profileData);
                      localStorage.removeItem("profile");
                    }}
                    className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            
            {/* Additional Info (Optional) */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl font2 p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="text-sm text-blue-800">
                    Your profile information is saved locally in your browser. This data will persist even after closing the browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}