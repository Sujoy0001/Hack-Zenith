const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Upload a lost/found post
 */
export async function uploadPost({
  title,
  description,
  type,
  place,
  area,
  tags,
  images,
  user,
}) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("types", type); // "lost" | "found"
  formData.append("place", place);
  formData.append("area", area);
  formData.append("tags", tags.join(","));

  formData.append("user_uid", user.uid);
  formData.append("user_email", user.email);
  formData.append("user_name", user.name);
  formData.append("user_photo", user.photoURL || "");

  images.forEach((img) => {
    formData.append("images", img);
  });

  const res = await fetch(`${API_BASE_URL}/posts/create`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`;

    try {
      const data = await res.json();
      if (data?.detail) {
        errorMessage = typeof data.detail === "string"
          ? data.detail
          : data.detail.map((e) => e.msg).join(", ");
      }
    } catch {
      errorMessage = await res.text();
    }

    throw new Error(errorMessage);
  }

  return await res.json();
}
