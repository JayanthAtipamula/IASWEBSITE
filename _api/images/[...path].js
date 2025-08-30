// Vercel serverless function to proxy images from Firebase Storage
// This function handles requests to /api/images/* paths

export default async function handler(req, res) {
  try {
    // Get the raw URL and path information from the request
    const fullPath = req.url || '';
    console.log('Full requested URL path:', fullPath);
    
    // Get the path segments from the query
    const pathSegments = req.query.path || [];
    console.log('Path segments from query:', JSON.stringify(pathSegments));
    
    // First try: use the direct URL if provided
    if (req.query.originalUrl) {
      console.log('Original URL parameter found:', req.query.originalUrl);
      try {
        const directResponse = await fetch(req.query.originalUrl);
        
        if (directResponse.ok) {
          console.log('Successfully fetched image using originalUrl parameter');
          
          const imageData = await directResponse.arrayBuffer();
          
          // Set headers
          res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
          
          const contentType = directResponse.headers.get('content-type');
          if (contentType) {
            res.setHeader('Content-Type', contentType);
          }
          
          return res.status(200).send(Buffer.from(imageData));
        }
      } catch (error) {
        console.error('Error fetching from originalUrl:', error);
      }
    }
    
    // Determine image path from segments
    let imagePath = '';
    
    if (Array.isArray(pathSegments) && pathSegments.length > 0) {
      // Join path segments for normal cases
      imagePath = pathSegments.join('/');
    } else if (typeof pathSegments === 'string') {
      // Handle case where it's a single string
      imagePath = pathSegments;
    } else {
      // If path extraction from query fails, try to extract from URL
      const matches = fullPath.match(/\/api\/images\/(.+?)(?:\?|$)/);
      if (matches && matches[1]) {
        imagePath = matches[1];
        console.log('Extracted path from URL:', imagePath);
      }
    }
    
    console.log('Final processed image path:', imagePath);
    
    if (!imagePath) {
      console.error('Unable to determine image path from request');
      
      // Last resort: Try to serve the social logo directly since that's a common issue
      if (fullPath.includes('THREEATOMS_SOCIAL_LOGO')) {
        return res.redirect(307, '/api/social-logo');
      }
      
      return res.status(400).send('Invalid image path - path is empty. Unable to determine which image to serve.');
    }
    
    // For typical paths, ensure correct Firebase Storage URL format
    // Construct the Firebase Storage URL
    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/${encodeURIComponent(imagePath)}?alt=media`;
    
    console.log(`Attempting to fetch from Firebase Storage: ${storageUrl}`);
    
    // Fetch the image from Firebase Storage
    const response = await fetch(storageUrl);
    
    if (!response.ok) {
      console.error(`Error fetching image: ${response.status} ${response.statusText}`);
      console.error(`Requested image path: ${imagePath}`);
      
      // Special case handler for specific image
      if (imagePath.includes('THREEATOMS_SOCIAL_LOGO')) {
        return res.redirect(307, '/api/social-logo');
      }
      
      return res.status(response.status).send(`Error fetching image (${response.status}): The image could not be found at the path: ${imagePath}`);
    }
    
    // Get the image data as an array buffer
    const imageData = await response.arrayBuffer();
    
    // Set cache control headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
    
    // Pass along the content type header if available
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    console.log(`Successfully proxied image: ${imagePath}`);
    
    // Send the image data
    return res.status(200).send(Buffer.from(imageData));
  } catch (error) {
    console.error('Error in image proxy:', error);
    
    // Return a more specific error message
    return res.status(500).send(`Server error processing the image: ${error.message}`);
  }
} 