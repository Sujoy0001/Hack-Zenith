// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Basic auth user
        setCurrentUser(user);

        // Fetch additional profile from Firestore
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // No extra profile yet – use defaults from auth
            setUserProfile({
              name: user.displayName || "",
              phone: "",
              address: "",
              photoURL: user.photoURL || "",
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setUserProfile({
            name: user.displayName || "",
            phone: "",
            address: "",
            photoURL: user.photoURL || "",
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Combined user object for easy access
  const value = {
    currentUser,
    userProfile,
    loading,
    // Helper: full user with merged data
    user: currentUser
      ? {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: userProfile?.name || currentUser.displayName || "",
          photoURL: userProfile?.photoURL || currentUser.photoURL || "",
          phone: userProfile?.phone || "",
          address: userProfile?.address || "",
          emailVerified: currentUser.emailVerified,
        }
      : null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}