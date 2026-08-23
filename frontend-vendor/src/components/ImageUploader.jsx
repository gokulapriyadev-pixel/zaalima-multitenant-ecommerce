import { useState } from 'react';

function ImageUploader({ onImagesChange, maxImages = 4 }) {
  const [previews, setPreviews] = useState([]);

  const handleFiles = (files) => {
    const fileArray = Array.from(files).slice(0, maxImages - previews.length);
    const newPreviews = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    if (onImagesChange) onImagesChange(updated.map((p) => p.file));
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (onImagesChange) onImagesChange(updated.map((p) => p.file));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>
      <div
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-sm text-gray-500">
          Drag & drop images here, or click to browse
        </p>
        <p className="text-xs text-gray-400 mt-1">Up to {maxImages} images</p>
      </div>

      {previews.length > 0 && (
        <div className="flex gap-3 mt-3 flex-wrap">
          {previews.map((p, i) => (
            <div key={i} className="relative w-20 h-20">
              <img
                src={p.url}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;