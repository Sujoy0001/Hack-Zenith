import React, { useState } from "react";
import { X, Upload, MapPin, Tag, Image as ImageIcon } from "lucide-react";
import { useUserData } from "../context/useUserData";
import { uploadPost } from "../api/upload";

export default function IssueUploadModal({ open, onClose }) {
  const userData = useUserData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [place, setPlace] = useState("");
  const [area, setArea] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const predefinedTags = [
    "Electronics",
    "Clothing",
    "Wallet",
    "Bag",
    "Pets",
    "Keys",
    "Documents",
    "Jewelry",
  ];

  if (!open) return null;

  /* ---------- Validation ---------- */
  const validateForm = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!type) e.type = "Please select a type";
    if (!place.trim() && !area.trim())
      e.location = "Please provide location information";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- Images ---------- */
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

  /* ---------- Tags ---------- */
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setCustomTag("");
    }
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  /* ---------- Submit ---------- */
  const submitIssue = async () => {
    if (!userData) {
      alert("Please login to create a post");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await uploadPost({
        title,
        description,
        type,
        place,
        area,
        tags: selectedTags,
        images,
        user: userData,
      });

      alert("Post submitted successfully");
      
      // Reset and close
      setTitle("");
      setDescription("");
      setType("");
      setPlace("");
      setArea("");
      setSelectedTags([]);
      setCustomTag("");
      setImages([]);
      setErrors({});
      onClose();
    } catch (err) {
      alert("Failed to submit post. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed font2 inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Create New Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setType("lost")}
                className={`flex-1 cursor-pointer py-2.5 px-4 border rounded-md transition-colors ${
                  type === "lost"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setType("found")}
                className={`flex-1 cursor-pointer py-2.5 px-4 border rounded-md transition-colors ${
                  type === "found"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Found
              </button>
            </div>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the item"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional details..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MapPin size={16} />
              Location <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Specific place"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Area/City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Tag size={16} />
              Tags
            </label>
            
            {/* Predefined Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 cursor-pointer py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                placeholder="Add custom tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-700 hover:text-red-600 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <ImageIcon size={16} />
              Images (Optional, max 5)
            </label>
            
            {/* Upload Area */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB each
                </p>
                {images.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute cursor-pointer -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={submitIssue}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                "Submit Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}