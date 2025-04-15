import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('gaussian');
  const [useGrayscale, setUseGrayscale] = useState(false);
  const [params, setParams] = useState({ ksize: 5, sigma: 1.5 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setFilteredImage(null); // Reset filtered image when new image is uploaded
      };
      img.onerror = () => setError('Failed to load image');
      img.src = event.target.result;
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const applyFilter = async () => {
    if (!originalImage) {
      setError('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        try {
          const formData = new FormData();
          formData.append('image', blob);
          formData.append('filter', activeFilter);
          formData.append('params', JSON.stringify(params));

          const response = await fetch('http://127.0.0.1:5000/apply-filter', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const resultBlob = await response.blob();
          setFilteredImage(URL.createObjectURL(resultBlob));
        } catch (err) {
          setError(`Failed to apply filter: ${err.message}`);
          console.error('Filter error:', err);
        } finally {
          setIsProcessing(false);
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      setError(`Processing failed: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const applyGrayscale = () => {
    if (!originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    
    ctx.putImageData(imageData, 0, 0);
    setFilteredImage(canvas.toDataURL());
  };

  return (
    <div className="container mt-4">
      <header className="text-center mb-4">
        <h1>Image Filtering Playground</h1>
      </header>

      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-3">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={isProcessing}
              className="form-control"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-6">
              <label className="form-label">Choose Filter:</label>
              <select 
                value={activeFilter} 
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setUseGrayscale(false);
                }}
                disabled={isProcessing}
                className="form-select"
              >
                <option value="gaussian">Gaussian Blur</option>
                <option value="median">Median Blur</option>
                <option value="laplacian">Laplacian</option>
                <option value="fft">FFT Spectrum</option>
              </select>
            </div>

            <div className="col-md-6 mt-3 mt-md-0">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="grayscaleRadio"
                  id="grayscaleRadio"
                  checked={useGrayscale}
                  onChange={() => {
                    setUseGrayscale(true);
                    setActiveFilter('grayscale');
                    applyGrayscale();
                  }}
                  disabled={isProcessing}
                />
                <label className="form-check-label" htmlFor="grayscaleRadio">
                  Convert to Grayscale
                </label>
              </div>
            </div>
          </div>

          {activeFilter === 'gaussian' && !useGrayscale && (
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Kernel Size: {params.ksize}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  step="2"
                  value={params.ksize}
                  onChange={(e) => setParams({...params, ksize: parseInt(e.target.value)})}
                  disabled={isProcessing}
                  className="form-range"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sigma: {params.sigma}</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1"
                  value={params.sigma}
                  onChange={(e) => setParams({...params, sigma: parseFloat(e.target.value)})}
                  disabled={isProcessing}
                  className="form-range"
                />
              </div>
            </div>
          )}

          {!useGrayscale && (
            <div className="text-center">
              <button 
                onClick={applyFilter} 
                disabled={!originalImage || isProcessing}
                className="btn btn-primary"
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : 'Apply Filter'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="text-center">Original Image</h3>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {originalImage ? (
                <img 
                  src={originalImage.src} 
                  alt="Original" 
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
              ) : (
                <div className="text-muted">No image uploaded</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="text-center">Filtered Image</h3>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              {filteredImage ? (
                <img 
                  src={filteredImage} 
                  alt="Filtered" 
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
              ) : (
                <div className="text-muted">Filtered result will appear here</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;