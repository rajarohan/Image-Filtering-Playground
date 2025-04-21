import React from 'react';

const LoaderButton = ({ onClick, isProcessing, disabled }) => (
  <div className="text-center mt-3">
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className="btn btn-primary btn-lg px-4"
    >
      {isProcessing ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Processing...
        </>
      ) : (
        <>
          <i className="bi bi-magic me-2"></i>
          Apply Filter
        </>
      )}
    </button>
  </div>
);

export default LoaderButton;