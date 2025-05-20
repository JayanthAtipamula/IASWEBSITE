import React, { useEffect } from 'react';

const TermsAndConditions: React.FC = () => {

  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/terms-and-conditions.html';
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to Terms and Conditions...</p>
    </div>
  );
};

export default TermsAndConditions;
