import React, { useState } from 'react';

interface CourseImageProps {
  imagePath: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  alt?: string;
}

/**
 * A component to display course images from Firebase Storage
 * This uses the specialized course image API endpoint
 */
const CourseImage: React.FC<CourseImageProps> = ({
  imagePath,
  width,
  height,
  className = '',
  alt = 'Course image'
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [alternatePathTried, setAlternatePathTried] = useState(false);
  
  // Make sure we have a valid path
  if (!imagePath) {
    console.error('No image path provided to CourseImage component');
    return null;
  }
  
  // Log the original path for debugging
  console.log('CourseImage component processing path:', imagePath);
  
  // Clean the path to ensure it's just the filename or relative path
  let cleanPath = '';
  
  // Check if it's a Firebase Storage URL
  if (imagePath.includes('firebasestorage.googleapis.com')) {
    cleanPath = imagePath
      .replace('https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/', '')
      .replace(/\?alt=media.*$/, '') // Remove query params
      .replace(/%2F/g, '/') // Replace URL encoded slashes
      .replace(/^courses\//, ''); // Remove redundant courses/ prefix
      
    console.log('Cleaned Firebase URL path:', cleanPath);
  } else if (imagePath.startsWith('data:')) {
    // Handle data URLs directly (often from FileReader)
    console.log('Using data URL directly');
    return (
      <img 
        src={imagePath}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  } else {
    // For non-Firebase URLs, use as-is
    cleanPath = imagePath.replace(/^courses\//, '');
    console.log('Using non-Firebase URL path:', cleanPath);
  }
  
  // Special case for the known problematic image
  if (cleanPath.includes('THREEATOMS_SOCIAL_LOGO')) {
    console.log('Using direct social logo endpoint');
    return (
      <img 
        src="/api/social-logo"
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }
  
  // Use the dedicated course image API endpoint
  // Include the original URL as a query parameter for fallback
  const proxyUrl = `/api/course-image/${cleanPath}?originalUrl=${encodeURIComponent(imagePath)}`;
  
  console.log('Final image proxy URL:', proxyUrl);
  
  // Separate handler for error fallback logic
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading course image (attempt ${errorCount + 1}), trying fallback`);
    
    // Track error count to prevent infinite loops
    setErrorCount(prev => prev + 1);
    
    // Different fallback strategies based on error count
    if (errorCount === 0) {
      // First fallback: try direct Firebase URL
      (e.target as HTMLImageElement).src = imagePath;
    } else if (errorCount === 1 && !alternatePathTried && 
               (cleanPath.includes(' ') || cleanPath.includes('(') || cleanPath.includes(')'))) {
      // Try an alternate path format for filenames with spaces and parentheses
      setAlternatePathTried(true);
      
      // Create a "fixed" path removing spaces and parentheses
      const fixedPath = cleanPath
        .replace(/ /g, '_')  // Replace spaces with underscores
        .replace(/[()]/g, ''); // Remove parentheses
        
      console.log('Trying alternate path format:', fixedPath);
      
      // Use the API with the fixed path
      (e.target as HTMLImageElement).src = `/api/course-image/${fixedPath}?originalUrl=${encodeURIComponent(imagePath)}`;
    } else if ((errorCount === 2 && alternatePathTried) || (errorCount === 1 && !alternatePathTried)) {
      // Try the debug endpoint to diagnose the issue
      console.log('All standard paths failed, trying debug endpoint');
      
      // The debug endpoint will let users inspect what's happening more closely
      (e.target as HTMLImageElement).src = `/api/debug-image?imagePath=courses/${cleanPath}`;
    } else {
      // Final fallback: use a placeholder
      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
      
      // Log the failure for debugging
      console.error('All image loading attempts failed for:', imagePath);
    }
  };
  
  return (
    <img 
      src={proxyUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
    />
  );
};

export default CourseImage; 