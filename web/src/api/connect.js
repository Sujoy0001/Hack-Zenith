const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useUserData } from "../context/useUserData";

export async function connectBackend() {
    const userData = useUserData();
    if (!userData) {
        throw new Error("User not authenticated");
    }
    const res = await fetch(`${API_BASE_URL}/test/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userData.uid, name: userData.name, email: userData.email }),
    });

    if (!res.ok) {
        throw new Error("Failed to connect to backend");
    }

    return res.json();
}

export function userID() {
    const userData = useUserData();
    return userData ? userData.uid : null;
}