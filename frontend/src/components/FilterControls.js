import React from 'react';

const FilterControls = ({
  activeFilter, setActiveFilter,
  useGrayscale, setUseGrayscale,
  applyGrayscale, params, setParams,
  isProcessing
}) => (
  <>
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
          <option value="histogram">Histogram</option>
          <option value="equalization">Histogram Equalization</option>
          <option value="stretching">Histogram Stretching</option>
        </select>
      </div>

      <div className="col-md-6 mt-3 mt-md-0">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="grayscaleSwitch"
            checked={useGrayscale}
            onChange={() => {
              setUseGrayscale(!useGrayscale);
              if (!useGrayscale) {
                setActiveFilter('grayscale');
                applyGrayscale();
              }
            }}
            disabled={isProcessing}
          />
          <label className="form-check-label" htmlFor="grayscaleSwitch">
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
            onChange={(e) => setParams({ ...params, ksize: parseInt(e.target.value) })}
            disabled={isProcessing}
            className="form-range"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Sigma: {params.sigma.toFixed(1)}</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={params.sigma}
            onChange={(e) => setParams({ ...params, sigma: parseFloat(e.target.value) })}
            disabled={isProcessing}
            className="form-range"
          />
        </div>
      </div>
    )}

    {activeFilter === 'median' && !useGrayscale && (
      <div className="row mb-3">
        <div className="col-md-12">
          <label className="form-label">Kernel Size: {params.ksize}</label>
          <input
            type="range"
            min="1"
            max="15"
            step="2"
            value={params.ksize}
            onChange={(e) => setParams({ ...params, ksize: parseInt(e.target.value) })}
            disabled={isProcessing}
            className="form-range"
          />
        </div>
      </div>
    )}
  </>
);

export default FilterControls;