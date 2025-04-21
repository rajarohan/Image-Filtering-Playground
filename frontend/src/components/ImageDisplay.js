import React from 'react';

const ImageDisplay = ({ originalImage, filteredImage, canvasRef, activeFilter }) => (
  <div className="row">
    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className="card-header bg-primary text-white text-center">
          <h3>Original Image</h3>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {originalImage ? (
            <img 
              src={originalImage.src} 
              alt="Original" 
              className="img-fluid rounded shadow" 
              style={{ maxHeight: '500px' }} 
            />
          ) : (
            <div className="text-muted p-5 text-center">
              <i className="bi bi-image fs-1"></i>
              <p className="mt-2">No image uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className="card-header bg-success text-white text-center">
          <h3>
            {activeFilter === 'histogram' ? 'Histogram Plot' : 
             activeFilter === 'equalization' ? 'Equalized Image' :
             activeFilter === 'stretching' ? 'Stretched Image' : 
             'Filtered Image'}
          </h3>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          {filteredImage ? (
            <img 
              src={filteredImage} 
              alt="Filtered" 
              className={`img-fluid rounded shadow ${activeFilter === 'histogram' ? 'bg-white p-3' : ''}`}
              style={{ 
                maxHeight: '500px',
                maxWidth: '100%'
              }} 
            />
          ) : (
            <div className="text-muted p-5 text-center">
              <i className="bi bi-sliders fs-1"></i>
              <p className="mt-2">
                {activeFilter === 'histogram' ? 'Histogram will appear here' : 
                 'Filtered result will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ImageDisplay;