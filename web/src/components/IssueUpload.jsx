import React, { useState } from "react";
import { X, Upload, XCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function IssueUploadModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // "LOST" or "FOUND"
  const [place, setPlace] = useState("");
  const [area, setArea] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // Array of tags
  const [customTag, setCustomTag] = useState("");
  const [images, setImages] = useState([]); // File objects
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedTags = ["ELECTRONICS", "CLOTHING", "WALLET", "BAG", "PETS", "KEYS", "DOCUMENTS"];

  if (!open) return null;

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addPredefinedTag = (e) => {
    const value = e.target.value;
    if (value && !selectedTags.includes(value)) {
      setSelectedTags((prev) => [...prev, value]);
    }
    e.target.value = ""; // Reset select
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim().toUpperCase())) {
      setSelectedTags((prev) => [...prev, customTag.trim().toUpperCase()]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const submitIssue = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!type) {
      alert("Type is required");
      return;
    }
    if (!place.trim() || !area.trim()) {
      alert("Location (place and area) is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("place", place);
      formData.append("area", area);
      formData.append("tags", selectedTags.join(',')); // send as comma-separated string

      images.forEach((img) => {
        formData.append("images", img); // multiple files with same key
      });

      const res = await fetch(`${API_BASE_URL}/posts/create`, {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type header — let browser set it with boundary
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit post");
      }

      const data = await res.json();
      alert("Post submitted successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setType("");
      setPlace("");
      setArea("");
      setSelectedTags([]);
      setCustomTag("");
      setImages([]);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg font2">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select type...</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Place *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Main Gate"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Campus Block A"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="space-y-2">
              {/* Predefined Tags Select */}
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={addPredefinedTag}
                disabled={isSubmitting}
              >
                <option value="">Select from common categories...</option>
                {predefinedTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={addCustomTag}
                  className="py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting || !customTag.trim()}
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Add Images (Max 5)
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-gray-600">Click to upload images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                      disabled={isSubmitting}
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={submitIssue}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Post"}
          </button>
        </div>
      </div>
    </div>
  );
}