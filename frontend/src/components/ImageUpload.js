import React from 'react';

const ImageUpload = ({ handleImageUpload, isProcessing }) => (
  <div className="mb-3">
    <label htmlFor="imageUpload" className="form-label">
      <i className="bi bi-upload me-2"></i>
      Upload Image
    </label>
    <input
      type="file"
      id="imageUpload"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={isProcessing}
      className="form-control"
    />
  </div>
);

export default ImageUpload;