import React from 'react';

const ImageUpload = ({ handleImageUpload, isProcessing }) => (
  <div className="mb-3">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={isProcessing}
      className="form-control"
    />
  </div>
);

export default ImageUpload;