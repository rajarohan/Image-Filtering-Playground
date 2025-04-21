import React from 'react';

const ImageDisplay = ({ originalImage, filteredImage, canvasRef }) => (
  <div className="row">
    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className="card-header text-center"><h3>Original Image</h3></div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {originalImage ? (
            <img src={originalImage.src} alt="Original" className="img-fluid" style={{ maxHeight: '500px' }} />
          ) : (
            <div className="text-muted">No image uploaded</div>
          )}
        </div>
      </div>
    </div>

    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className="card-header text-center"><h3>Filtered Image</h3></div>
        <div className="card-body d-flex justify-content-center align-items-center">
          {filteredImage ? (
            <img src={filteredImage} alt="Filtered" className="img-fluid" style={{ maxHeight: '500px' }} />
          ) : (
            <div className="text-muted">Filtered result will appear here</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ImageDisplay;