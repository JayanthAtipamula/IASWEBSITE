import fs from 'node:fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  const url = req.url;
  
  console.log('SSR API: Handler called for URL:', url);
  console.log('SSR API: Request method:', req.method);
  console.log('SSR API: Full request info:', {
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    headers: req.headers
  });
  
  // Skip SSR for static assets - let Vercel handle them normally
  if (url.startsWith('/assets/') || 
      url.startsWith('/favicon') || 
      url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    console.log('SSR API: Skipping SSR for static asset:', url);
    return res.status(404).end();
  }
  
  // Full template with all meta tags and SEO optimization
  const fullTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
    
    <!-- Primary Meta Tags -->
    <title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>
    <meta name="title" content="Epitome IAS Academy - Best UPSC Coaching in Hyderabad" />
    <meta name="description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />
    <meta name="keywords" content="UPSC coaching, IAS coaching, civil services exam preparation, best UPSC coaching in Hyderabad, IAS academy Hyderabad, UPSC preparation, IAS preparation, civil services coaching, UPSC study materials, IAS mentoring, Epitome IAS Academy" />
    <meta name="author" content="Epitome IAS Academy" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://epitomeias.in/" />
    <meta property="og:title" content="Epitome IAS Academy - Best UPSC Coaching in Hyderabad" />
    <meta property="og:description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />
    <meta property="og:image" content="/favicon.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://epitomeias.in/" />
    <meta property="twitter:title" content="Epitome IAS Academy - Best UPSC Coaching in Hyderabad" />
    <meta property="twitter:description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />
    <meta property="twitter:image" content="/favicon.png" />

    <!-- Additional Meta Tags -->
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://epitomeias.in/" />

    <!-- Mobile App Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Epitome IAS" />

    <!-- Cache Control -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />

    <!-- Geo Tags -->
    <meta name="geo.region" content="IN-TG" />
    <meta name="geo.placename" content="Hyderabad" />
    <meta name="geo.position" content="17.385044;78.486671" />
    <meta name="ICBM" content="17.385044, 78.486671" />

    <!-- Site Verification -->
    <meta name="google-site-verification" content="your-google-verification-code" />
    <script type="module" crossorigin src="/assets/main-yo-dzlPx.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/main-BGXVWqQq.css">
  </head>
  <body>
    <div id="root"><!--ssr-outlet--></div>
  </body>
</html>`;

  try {
    // Use the embedded full template
    let template = fullTemplate;
    let renderedContent = '';
    
    // Use the built server entry point (the correct approach)
    try {
      // Import the built server render function - use relative path for Vercel
      console.log('SSR API: Attempting to import entry-server.js');
      const serverEntry = await import('./entry-server.js');
      console.log('SSR API: Entry server imported successfully');
      
      const render = serverEntry.render || serverEntry.default?.render;
      console.log('SSR API: Render function available:', !!render);
      
      if (render) {
        console.log('SSR API: Starting render for URL:', url);
        // Use your existing SSR logic that was working
        const rendered = await render(url);
        console.log('SSR API: Render completed:', !!rendered);
        
        if (rendered && rendered.html) {
          renderedContent = rendered.html;
          console.log('SSR API: HTML content length:', rendered.html.length);
          
          // Inject initial data for client-side hydration
          if (rendered.initialData) {
            const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(rendered.initialData)};</script>`;
            template = template.replace('</head>', `${dataScript}</head>`);
            console.log('SSR API: Initial data injected');
          }
        } else {
          console.log('SSR API: No HTML content in rendered result');
        }
      } else {
        console.log('SSR API: No render function found');
      }
    } catch (renderError) {
      console.error('SSR API: Render error:', renderError);
      // Silent fallback to client-side rendering
      renderedContent = '';
    }
    
    // Replace SSR outlet with rendered content (or empty for client-side)
    const html = template.replace('<!--ssr-outlet-->', renderedContent);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).send(html);
    
  } catch (error) {
    // Silent error handling - return full template with CSS
    const html = fullTemplate.replace('<!--ssr-outlet-->', '');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).send(html);
  }
}