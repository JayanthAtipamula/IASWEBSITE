const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

// Image proxy function to serve Firebase Storage images from your own domain
exports.imageProxy = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Assume the requested path starts with /images/ and then the image file name or path
  // e.g. a request to /images/my_photo.jpg or /images/courses/course1.jpg
  const imagePath = req.path.replace(/^\/images\//, '');
  
  if (!imagePath) {
    res.status(400).send('Invalid image path');
    return;
  }
  
  // Build the URL for your storage
  // Using the project ID from your .env file: epitome-ias
  const storageUrl = `https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/${encodeURIComponent(imagePath)}?alt=media`;
  
  try {
    console.log(`Fetching image from: ${storageUrl}`);
    const response = await fetch(storageUrl);
    
    if (!response.ok) {
      console.error(`Error fetching image: ${response.status} ${response.statusText}`);
      res.status(response.status).send('Error fetching image');
      return;
    }
    
    // Set cache control headers for better performance
    res.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
    
    // Pass along the content type header if available
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.set('Content-Type', contentType);
    }
    
    // Pipe the image data to the client
    response.body.pipe(res);
  } catch (error) {
    console.error('Error in image proxy:', error);
    res.status(500).send('Server error');
  }
}); 