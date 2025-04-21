import React, { useState, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import FilterControls from './components/FilterControls';
import ImageDisplay from './components/ImageDisplay';
import ErrorAlert from './components/ErrorAlert';
import LoaderButton from './components/LoaderButton';

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
        setFilteredImage(null);
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

          let endpoint = 'apply-filter';
          if (activeFilter === 'histogram') {
            endpoint = 'histogram';
          } else if (activeFilter === 'equalization') {
            endpoint = 'equalize-histogram';
          } else if (activeFilter === 'stretching') {
            endpoint = 'stretch-histogram';
          }

          const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
          }

          const resultBlob = await response.blob();
          setFilteredImage(URL.createObjectURL(resultBlob));
        } catch (err) {
          setError(`Failed to apply filter: ${err.message}`);
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
      <Header />
      <div className="card mb-4">
        <div className="card-body">
          <ImageUpload handleImageUpload={handleImageUpload} isProcessing={isProcessing} />
          <ErrorAlert error={error} />
          <FilterControls
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            useGrayscale={useGrayscale}
            setUseGrayscale={setUseGrayscale}
            applyGrayscale={applyGrayscale}
            params={params}
            setParams={setParams}
            isProcessing={isProcessing}
          />
          {!useGrayscale && (
            <LoaderButton
              onClick={applyFilter}
              isProcessing={isProcessing}
              disabled={!originalImage || isProcessing}
            />
          )}
        </div>
      </div>
      <ImageDisplay
        originalImage={originalImage}
        filteredImage={filteredImage}
        canvasRef={canvasRef}
        activeFilter={activeFilter}
      />
    </div>
  );
}

export default App;