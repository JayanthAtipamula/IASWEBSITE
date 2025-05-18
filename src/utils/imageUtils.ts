/**
 * Converts a Firebase Storage URL to a local image proxy URL
 * This will route through the appropriate proxy based on the deployment environment
 * 
 * @param firebaseUrl The original Firebase Storage URL
 * @returns A proxied URL that uses our own domain
 */
export function getProxiedImageUrl(firebaseUrl: string | null | undefined): string {
  if (!firebaseUrl) {
    console.warn('Empty URL provided to getProxiedImageUrl');
    // Return a default image or empty string if no URL provided
    return '';
  }
  
  try {
    // For direct debugging, log the Firebase URL we're trying to proxy
    console.log('Processing URL in getProxiedImageUrl:', firebaseUrl);
    
    // Handle the Three Atoms social logo specifically
    if (firebaseUrl.includes('THREEATOMS_SOCIAL_LOGO')) {
      console.log('Detected Social Logo, using dedicated endpoint');
      return '/api/social-logo';
    }
    
    // Check if this is a Firebase Storage URL
    if (firebaseUrl.includes('firebasestorage.googleapis.com')) {
      // Extract the file path from the Firebase Storage URL
      // Format example: https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/images%2Fexample.jpg?alt=media&token=abc123
      const url = new URL(firebaseUrl);
      
      // Extract the path part after /o/
      const pathMatch = url.pathname.match(/\/o\/(.+)$/);
      
      if (pathMatch && pathMatch[1]) {
        // Decode the URL-encoded path
        const decodedPath = decodeURIComponent(pathMatch[1]);
        console.log('Decoded path from Firebase URL:', decodedPath);
        
        // Determine the folder - check if it's a course image
        const isCourseImage = decodedPath.startsWith('courses/');
        
        // Use the appropriate API endpoint based on the image type
        if (isCourseImage) {
          // For course images, use the dedicated course image handler
          // Remove the courses/ prefix since the API adds it
          const courseImagePath = decodedPath.replace(/^courses\//, '');
          console.log('Using course image endpoint with path:', courseImagePath);
          return `/api/course-image/${courseImagePath}?originalUrl=${encodeURIComponent(firebaseUrl)}`;
        } else {
          // For other images, use the general image handler
          console.log('Using general image endpoint with path:', decodedPath);
          return `/api/images/${decodedPath}?originalUrl=${encodeURIComponent(firebaseUrl)}`;
        }
      } else {
        console.error('Failed to extract path from Firebase URL:', firebaseUrl);
      }
    } else {
      console.log('Not a Firebase Storage URL, returning original:', firebaseUrl);
    }
    
    // If not a Firebase URL or couldn't extract the path, return the original URL
    return firebaseUrl;
  } catch (error) {
    console.error('Error processing image URL:', error, 'Original URL:', firebaseUrl);
    return firebaseUrl;
  }
} 