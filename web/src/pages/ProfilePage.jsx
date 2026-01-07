import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        const newProfile = {
          name: user.displayName || "",
          email: user.email || "",
          image: user.photoURL || "",
          phone: "",
          address: "",
          createdAt: serverTimestamp(),
        };
        await setDoc(ref, newProfile);
        setProfile(newProfile);
      }
    };

    loadProfile();
  }, [user]);

  if (!profile) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const saveProfile = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      phone: profile.phone,
      address: profile.address,
      updatedAt: serverTimestamp(),
    });

    alert("Profile saved successfully");
  };

  return (
    <div className="min-h-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 font2">
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and profile picture
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="rounded-xl p-6 font2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Picture
              </h2>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt="Profile"
                      className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-full flex items-center justify-center bg-gray-200 border-4 border-gray-100">
                      <User size={64} className="text-gray-500" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Managed via Google account
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="rounded-xl p-6 font2">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Personal Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={profile.name}
                    disabled
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border rounded-lg resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-end">
                  <button
                    onClick={saveProfile}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl font2 p-4"><div class="flex items-start"><svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div><p class="text-sm text-blue-800">Your profile information is saved in firebase. You can login in your phone with your same email id.</p></div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
