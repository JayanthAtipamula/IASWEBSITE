// Debug endpoint for diagnosing image loading issues
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'epitome-ias.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let storage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

storage = getStorage(app);

export default async function handler(req, res) {
  try {
    // Start with a simple HTML response
    let responseHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Debug Information</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #333; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
        .section { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #ddd; padding: 8px; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        tr:hover { background-color: #ddd; }
        th { padding-top: 12px; padding-bottom: 12px; text-align: left; background-color: #4CAF50; color: white; }
      </style>
    </head>
    <body>
      <h1>Image Debug Information</h1>
      
      <div class="section">
        <h2>Request URL</h2>
        <pre>${req.url || 'No URL information'}</pre>
      </div>
      
      <div class="section">
        <h2>Request Method</h2>
        <pre>${req.method || 'No method information'}</pre>
      </div>
      
      <div class="section">
        <h2>Query Parameters</h2>
        <pre>${JSON.stringify(req.query || {}, null, 2)}</pre>
      </div>
      
      <div class="section">
        <h2>Headers</h2>
        <pre>${JSON.stringify(req.headers || {}, null, 2)}</pre>
      </div>
    `;
    
    // If an image path is provided, try to fetch it and display results
    if (req.query.imagePath) {
      const imagePath = req.query.imagePath;
      responseHtml += `
      <div class="section">
        <h2>Image Path Test</h2>
        <p>Testing path: <code>${imagePath}</code></p>
      `;
      
      // Try different variations of the path
      const pathVariations = [
        imagePath,
        // Try replacing spaces with underscores
        imagePath.replace(/ /g, '_'),
        // Try removing parentheses
        imagePath.replace(/[()]/g, ''),
        // Try both
        imagePath.replace(/ /g, '_').replace(/[()]/g, ''),
      ];
      
      responseHtml += `
        <h3>Testing Path Variations</h3>
        <table>
          <tr>
            <th>Variation</th>
            <th>Status</th>
          </tr>
      `;
      
      for (const pathVariant of pathVariations) {
        try {
          // Try to construct and fetch Storage URL
          const storageUrl = `https://firebasestorage.googleapis.com/v0/b/epitome-ias.appspot.com/o/${encodeURIComponent(pathVariant)}?alt=media`;
          
          const response = await fetch(storageUrl);
          
          responseHtml += `
          <tr>
            <td><code>${pathVariant}</code></td>
            <td style="color: ${response.ok ? 'green' : 'red'}">
              ${response.ok ? '✅ Success' : '❌ Error'} - HTTP ${response.status} ${response.statusText}
            </td>
          </tr>
          `;
          
          if (response.ok) {
            responseHtml += `
            </table>
            <p>Found working path: <code>${pathVariant}</code></p>
            <p>Storage URL: <code>${storageUrl}</code></p>
            <p>Content-Type: ${response.headers.get('content-type')}</p>
            <p>Image preview:</p>
            <img src="${storageUrl}" style="max-width: 300px; max-height: 300px; border: 1px solid #ddd;" />
            `;
            break;
          }
        } catch (error) {
          responseHtml += `
          <tr>
            <td><code>${pathVariant}</code></td>
            <td style="color: red">❌ Error: ${error.message}</td>
          </tr>
          `;
        }
      }
      
      responseHtml += `</table>`;
      
      // If directory listing is requested, try to list files in the directory
      if (req.query.listDir === 'true') {
        try {
          // Try to list directory contents
          const dirPath = imagePath.split('/').slice(0, -1).join('/');
          
          responseHtml += `
          <h3>Directory Contents for: <code>${dirPath}</code></h3>
          <p>Attempting to list files in this directory to find similar files...</p>
          `;
          
          try {
            const dirRef = ref(storage, dirPath);
            const listResult = await listAll(dirRef);
            
            if (listResult.items.length > 0) {
              responseHtml += `
              <table>
                <tr>
                  <th>Filename</th>
                  <th>Actions</th>
                </tr>
              `;
              
              for (const item of listResult.items) {
                const itemPath = item.fullPath;
                const itemName = item.name;
                
                responseHtml += `
                <tr>
                  <td><code>${itemName}</code></td>
                  <td>
                    <a href="/api/debug-image?imagePath=${encodeURIComponent(itemPath)}" target="_blank">Test this path</a>
                  </td>
                </tr>
                `;
              }
              
              responseHtml += `</table>`;
            } else {
              responseHtml += `<p>No files found in this directory.</p>`;
            }
          } catch (listError) {
            responseHtml += `<p style="color: red">Error listing directory: ${listError.message}</p>`;
          }
        } catch (error) {
          responseHtml += `<p style="color: red">Error accessing directory: ${error.message}</p>`;
        }
      } else {
        responseHtml += `
        <p>
          <a href="/api/debug-image?imagePath=${encodeURIComponent(imagePath)}&listDir=true">
            List files in this directory
          </a>
        </p>
        `;
      }
      
      responseHtml += `</div>`;
    }
    
    // Add a form to test an image path
    responseHtml += `
      <div class="section">
        <h2>Test an Image Path</h2>
        <form method="GET">
          <div>
            <label for="imagePath">Firebase Storage Path:</label>
            <input type="text" id="imagePath" name="imagePath" style="width: 100%; padding: 8px; margin: 5px 0;" 
              placeholder="e.g., courses/1744883588490_THREEATOMS_SOCIAL_LOGO.png" />
          </div>
          <div style="margin-top: 8px;">
            <label>
              <input type="checkbox" name="listDir" value="true" /> 
              List directory contents
            </label>
          </div>
          <button type="submit" style="margin-top: 10px; padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Test Path
          </button>
        </form>
      </div>
    `;
    
    // Close the HTML
    responseHtml += `
    </body>
    </html>
    `;
    
    // Send the response
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(responseHtml);
  } catch (error) {
    console.error('Error in debug handler:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
} 