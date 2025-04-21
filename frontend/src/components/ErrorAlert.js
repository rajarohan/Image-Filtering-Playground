import React from 'react';

const ErrorAlert = ({ error }) => (
  error ? (
    <div className="alert alert-danger mt-3">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {error}
    </div>
  ) : null
);

export default ErrorAlert;