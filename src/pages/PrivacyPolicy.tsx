import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/privacy-policy.html';
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to Privacy Policy...</p>
    </div>
  );
};

export default PrivacyPolicy;
