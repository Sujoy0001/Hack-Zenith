import { useAuth } from "./AuthContext";

export function useUserData() {
  const auth = useAuth();

  if (!auth || !auth.currentUser) return null;

  const { currentUser, userProfile } = auth;

  return {
    uid: currentUser.uid,
    email: currentUser.email,
    name: userProfile?.name || currentUser.displayName || "",
    photoURL: userProfile?.photoURL || currentUser.photoURL || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
  };
}
