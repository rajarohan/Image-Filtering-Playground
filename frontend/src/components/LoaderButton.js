import React from 'react';

const LoaderButton = ({ onClick, isProcessing, disabled }) => (
  <div className="text-center">
    <button onClick={onClick} disabled={disabled} className="btn btn-primary">
      {isProcessing ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Processing...
        </>
      ) : 'Apply Filter'}
    </button>
  </div>
);

export default LoaderButton;