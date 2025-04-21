import React from 'react';

const ErrorAlert = ({ error }) => (
  error ? <div className="alert alert-danger">{error}</div> : null
);

export default ErrorAlert;