import { useState } from "react";
import { X, Upload, XCircle } from "lucide-react";

export default function IssueUploadModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  if (!open) return null;

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const submitIssue = () => {
    if (!title.trim()) {
      alert("Title required");
      return;
    }
    onSubmit({ title, description, images });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-999">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg font2">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Report Issue</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
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
              placeholder="Enter issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Add Images (Max 5)</label>
            
            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50">
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-gray-600">Click to upload images</span>
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
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border cursor-pointer border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submitIssue}
            className="flex-1 py-2.5 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}