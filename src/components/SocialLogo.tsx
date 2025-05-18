import React from 'react';

interface SocialLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  alt?: string;
}

/**
 * A component to display the Three Atoms Social Logo
 * This uses a dedicated API endpoint to ensure the image loads properly
 */
const SocialLogo: React.FC<SocialLogoProps> = ({
  width = 100,
  height = 100,
  className = '',
  alt = 'Three Atoms Social Logo'
}) => {
  // Use the dedicated API endpoint for this specific image
  const imageUrl = '/api/social-logo';
  
  return (
    <img 
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        console.error('Error loading social logo, falling back to direct URL');
        // Fallback to direct Firebase URL if the API endpoint fails
        (e.target as HTMLImageElement).src = 'https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/courses%2F1744883588490_THREEATOMS_SOCIAL_LOGO.png?alt=media&token=15d91d4b-2fc4-48c6-b7b1-ad14ab28c94f';
      }}
    />
  );
};

export default SocialLogo; 