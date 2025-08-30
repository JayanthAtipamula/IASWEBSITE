// Specialized handler for course images

export default async function handler(req, res) {
  try {
    // Log full request details for debugging
    console.log('Course image request URL:', req.url);
    console.log('Course image request query:', JSON.stringify(req.query));
    
    // Extract the course image path
    const pathSegments = req.query.path || [];
    console.log('Course image path segments:', JSON.stringify(pathSegments));
    
    // First, check if originalUrl is provided as a fallback
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
        } else {
          console.error(`Original URL fetch failed with status: ${directResponse.status}`);
        }
      } catch (error) {
        console.error('Error fetching from originalUrl:', error);
      }
    }
    
    // If originalUrl fallback didn't work, proceed with path processing
    let imagePath = '';
    
    if (Array.isArray(pathSegments) && pathSegments.length > 0) {
      imagePath = pathSegments.join('/');
    } else if (typeof pathSegments === 'string') {
      imagePath = pathSegments;
    } else {
      // Try to parse from URL if query param extraction failed
      const matches = req.url ? req.url.match(/\/api\/course-image\/(.+?)(?:\?|$)/) : null;
      if (matches && matches[1]) {
        imagePath = matches[1];
        console.log('Extracted path from URL:', imagePath);
      }
    }
    
    console.log('Processed course image path:', imagePath);
    
    if (!imagePath) {
      // Special case for direct images we know about
      if (req.url && req.url.includes('THREEATOMS_SOCIAL_LOGO')) {
        return res.redirect(307, '/api/social-logo');
      }
      
      return res.status(400).send('Invalid course image path - path is empty');
    }
    
    // Clean up the path - handle URL encoded paths
    imagePath = decodeURIComponent(imagePath);
    
    // Handle both possible formats:
    // 1. Just the filename: 1744883588490_THREEATOMS_SOCIAL_LOGO.png
    // 2. Full path: courses/1744883588490_THREEATOMS_SOCIAL_LOGO.png
    // 3. Path with encoded slashes: courses%2F1744883588490_THREEATOMS_SOCIAL_LOGO.png
    
    // Ensure path has the courses/ prefix
    if (!imagePath.startsWith('courses/') && !imagePath.startsWith('/courses/')) {
      imagePath = `courses/${imagePath}`;
    }
    
    // Remove any leading slash
    imagePath = imagePath.replace(/^\//, '');
    
    console.log('Final course image path:', imagePath);
    
    // If this is the Three Atoms logo, use the dedicated handler
    if (imagePath.includes('THREEATOMS_SOCIAL_LOGO')) {
      console.log('Detected Social Logo, redirecting to dedicated endpoint');
      return res.redirect(307, '/api/social-logo');
    }
    
    // Try multiple variations of the path if it contains special characters
    const pathVariations = [
      imagePath,
    ];
    
    // If the filename contains spaces or parentheses, add alternative formats to try
    if (imagePath.includes(' ') || imagePath.includes('(') || imagePath.includes(')')) {
      // Add alternate formats to try
      pathVariations.push(
        // Replace spaces with underscores
        imagePath.replace(/ /g, '_'),
        // Remove parentheses
        imagePath.replace(/[()]/g, ''),
        // Both replacements
        imagePath.replace(/ /g, '_').replace(/[()]/g, '')
      );
      console.log('Added alternate path formats due to special characters:', pathVariations);
    }
    
    let imageData = null;
    let contentType = null;
    let finalPath = null;
    
    // Try each path variation until one works
    for (const pathVariant of pathVariations) {
      try {
        // Construct the Firebase Storage URL for this variant
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/${encodeURIComponent(pathVariant)}?alt=media`;
        console.log(`Trying path variation: ${pathVariant}`);
        console.log(`Fetching from Firebase Storage URL: ${storageUrl}`);
        
        const response = await fetch(storageUrl);
        
        if (response.ok) {
          // Found a working path!
          console.log(`Success with path variation: ${pathVariant}`);
          imageData = await response.arrayBuffer();
          contentType = response.headers.get('content-type');
          finalPath = pathVariant;
          break;
        } else {
          console.log(`Failed with path variation (${response.status}): ${pathVariant}`);
        }
      } catch (error) {
        console.error(`Error trying path variation ${pathVariant}:`, error);
      }
    }
    
    // If we found a working path, serve the image
    if (imageData && contentType) {
      // Set headers
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
      res.setHeader('Content-Type', contentType);
      
      console.log('Successfully served course image with path:', finalPath);
      
      // Return the image
      return res.status(200).send(Buffer.from(imageData));
    }
    
    // If all path variations failed, try the original URL again as last resort
    if (req.query.originalUrl) {
      console.log('All path variations failed. Retrying with original URL as last resort');
      return res.redirect(307, req.query.originalUrl);
    }
    
    // If everything failed, suggest using the debug endpoint
    const debugUrl = `/api/debug-image?imagePath=${encodeURIComponent(imagePath)}`;
    
    // Return an error with a link to the debug endpoint
    return res.status(404).send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Image Not Found</h1>
          <p>Error fetching course image: 404 Not Found</p>
          <p>We tried several variations of this path but couldn't find the image:</p>
          <pre>${pathVariations.join('\n')}</pre>
          <p>
            <a href="${debugUrl}" target="_blank">
              Click here to use the debug tool to investigate this issue
            </a>
          </p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in course image handler:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
} 