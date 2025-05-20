import React, { useEffect } from 'react';

const RefundPolicy: React.FC = () => {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/refund-policy.html';
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to Refund Policy...</p>
    </div>
  );
};

export default RefundPolicy;
