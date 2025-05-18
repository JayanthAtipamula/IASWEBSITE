// Dedicated handler for the THREEATOMS_SOCIAL_LOGO.png image

export default async function handler(req, res) {
  console.log('Social logo direct handler called');
  
  // Direct Firebase URL for the image
  const directUrl = 'https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/courses%2F1744883588490_THREEATOMS_SOCIAL_LOGO.png?alt=media&token=15d91d4b-2fc4-48c6-b7b1-ad14ab28c94f';
  
  try {
    console.log('Fetching from direct URL:', directUrl);
    
    const response = await fetch(directUrl);
    
    if (!response.ok) {
      console.error('Error fetching direct image URL:', response.status, response.statusText);
      return res.status(response.status).send(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Get the image data
    const imageData = await response.arrayBuffer();
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
    
    // Set content type
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    console.log('Successfully returned social logo image');
    
    // Return the image data
    return res.status(200).send(Buffer.from(imageData));
  } catch (error) {
    console.error('Error in social logo handler:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
} 