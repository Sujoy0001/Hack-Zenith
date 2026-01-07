const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getPosts(page = 1, limit = 10) {
  const res = await fetch(
    `${API_BASE_URL}/posts/get_all?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
