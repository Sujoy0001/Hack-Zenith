import React, { useState } from "react";
import { X, Upload, XCircle, MapPin, Tag, Type, MessageSquare, Image as ImageIcon } from "lucide-react";
import { useUserData } from "../context/useUserData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function IssueUploadModal({ open, onClose }) {
  const userData = useUserData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // lowercase: 'lost' or 'found'
  const [place, setPlace] = useState("");
  const [area, setArea] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  const predefinedTags = [
    "ELECTRONICS",
    "CLOTHING",
    "WALLET",
    "BAG",
    "PETS",
    "KEYS",
    "DOCUMENTS",
  ];

  if (!open) return null;

  // Handle image upload and max 5 check
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  // Remove selected image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add predefined tag
  const addPredefinedTag = (e) => {
    const value = e.target.value;
    if (value && !selectedTags.includes(value)) {
      setSelectedTags((prev) => [...prev, value]);
    }
    e.target.value = "";
  };

  // Add custom tag
  const addCustomTag = () => {
    const tag = customTag.trim().toUpperCase();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setCustomTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Validate form, return true if valid
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!type) newErrors.type = "Type is required";
    if (!place.trim() && !area.trim()) {
      newErrors.location = "Either Place or Area is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler - FIXED VERSION
  const submitIssue = async () => {
    if (!userData) {
      alert("User not authenticated");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("types", type); // lowercase: 'lost' or 'found'
      formData.append("place", place);
      formData.append("area", area);
      formData.append("tags", selectedTags.join(","));

      formData.append("user_uid", userData.uid);
      formData.append("user_email", userData.email);
      formData.append("user_name", userData.name);
      formData.append("user_photo", userData.photoURL || "");

      images.forEach((img) => {
        formData.append("images", img);
      });

      console.log("Submitting form data...");

      const res = await fetch(`${API_BASE_URL}/posts/create`, {
        method: "POST",
        body: formData,
      });

      // Check if response is OK (status 200-299)
      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        
        // Try to get error details from response
        try {
          const errorData = await res.json();
          console.error("Error response:", errorData);
          
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map(err => err.msg).join(", ");
            } else if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            }
          }
        } catch (parseError) {
          // If response is not JSON, try to get text
          const text = await res.text();
          errorMessage = text || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Try to parse successful response
      let responseData;
      try {
        responseData = await res.json();
        console.log("Success response:", responseData);
      } catch (jsonError) {
        console.warn("Response is not JSON, but request was successful");
        // If it's a 201 Created but no JSON, that's OK
        if (res.status === 201) {
          responseData = { success: true };
        } else {
          throw new Error("Invalid response format from server");
        }
      }

      alert("Post submitted successfully!");

      // Reset all form fields
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
      console.error("Submit error:", err);
      // Show user-friendly error message
      const errorMsg = err.message.includes("'lost' or 'found'") 
        ? "Please select either 'Lost' or 'Found'"
        : err.message || "Something went wrong. Please try again.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font2">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
            <p className="text-gray-500 text-sm mt-1">Share details about lost or found item</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <Type size={18} />
              Title *
            </label>
            <input
              className={`w-full border-2 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.title ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="e.g., Lost Black Wallet near Central Park"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby="title-error"
            />
            {errors.title && (
              <p id="title-error" className="text-red-500 text-sm mt-1 ml-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <MessageSquare size={18} />
              Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("lost")}
                className={`rounded-xl p-4 border-2 transition-all ${
                  type === "lost"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-red-300"
                }`}
                type="button"
              >
                <div className="font-semibold">Lost</div>
                <div className="text-sm text-gray-600">Something you lost</div>
              </button>
              <button
                onClick={() => setType("found")}
                className={`rounded-xl p-4 border-2 transition-all ${
                  type === "found"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
                type="button"
              >
                <div className="font-semibold">Found</div>
                <div className="text-sm text-gray-600">Something you found</div>
              </button>
            </div>
            <select
              className={`w-full border-2 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mt-2 ${
                errors.type ? "border-red-500" : "border-gray-200"
              }`}
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-invalid={errors.type ? "true" : "false"}
              aria-describedby="type-error"
            >
              <option value="">Or select from dropdown</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            {errors.type && (
              <p id="type-error" className="text-red-500 text-sm mt-1 ml-1">
                {errors.type}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <MapPin size={18} />
              Location *
              <span className="text-gray-400 text-sm font-normal">(at least one)</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  className={`border-2 rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.location && !place ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Specific place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  aria-invalid={errors.location && !place ? "true" : "false"}
                />
                <div className="text-sm text-gray-500 ml-1">e.g., Starbucks, Library, etc.</div>
              </div>
              <div className="space-y-1">
                <input
                  className={`border-2 rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.location && !area ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Area or region"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  aria-invalid={errors.location && !area ? "true" : "false"}
                />
                <div className="text-sm text-gray-500 ml-1">e.g., Manhattan, Downtown</div>
              </div>
            </div>
            {errors.location && (
              <p id="location-error" className="text-red-500 text-sm mt-1 ml-1">
                {errors.location}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <Tag size={18} />
              Tags
            </label>
            
            <div className="space-y-2">
              <select
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                onChange={addPredefinedTag}
                aria-label="Select predefined tag"
              >
                <option value="">Select from common tags</option>
                {predefinedTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0) + tag.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              
              <div className="flex gap-3">
                <input
                  className="flex-1 border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Create custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                  aria-label="Custom tag input"
                />
                <button
                  onClick={addCustomTag}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors shadow-sm"
                  type="button"
                  aria-label="Add custom tag"
                >
                  Add
                </button>
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Selected tags:</div>
                <div className="flex flex-wrap gap-2" aria-live="polite">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 font-medium"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600 transition-colors"
                        aria-label={`Remove tag ${tag}`}
                        type="button"
                      >
                        <XCircle size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <MessageSquare size={18} />
              Description
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Provide detailed description of the item, including brand, color, distinguishing features, when and where it was lost/found..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <ImageIcon size={18} />
              Images
              <span className="text-gray-400 text-sm font-normal">(max 5)</span>
            </label>
            
            <label className="block border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-blue-50">
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Upload className="text-blue-600" size={28} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">Click to upload images</div>
                  <div className="text-sm text-gray-500">JPEG, PNG or WebP (Max 5MB each)</div>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleImages}
                aria-label="Upload images"
              />
            </label>

            {images.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={URL.createObjectURL(img)}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          alt={`Selected ${i + 1}`}
                        />
                      </div>
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                        aria-label={`Remove image ${i + 1}`}
                        type="button"
                      >
                        <XCircle size={20} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                        {img.name.substring(0, 12)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 rounded-xl py-4 font-medium hover:bg-gray-100 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={submitIssue}
              disabled={isSubmitting}
              className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-4 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                "Submit Post"
              )}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Your post will be visible to the community once submitted
          </p>
        </div>
      </div>
    </div>
  );
}