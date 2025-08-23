import fs from 'node:fs/promises';
import path from 'node:path';

export default async function handler(req, res) {
  const url = req.url;

  try {
    // In Vercel, files are in different locations
    // The build output is in the function's directory
    const templatePath = path.join(process.cwd(), 'dist/client/index.html');
    const serverPath = path.join(process.cwd(), 'dist/server/entry-server.js');
    
    console.log('Template path:', templatePath);
    console.log('Server path:', serverPath);
    console.log('CWD:', process.cwd());
    console.log('URL:', url);
    
    // Check if files exist
    try {
      await fs.access(templatePath);
      console.log('Template file exists');
    } catch {
      console.log('Template file does not exist');
    }
    
    try {
      await fs.access(serverPath);
      console.log('Server file exists');
    } catch {
      console.log('Server file does not exist');
    }
    
    // Read the built HTML template
    const template = await fs.readFile(templatePath, 'utf-8');
    
    // Import the server-side render function
    const serverModule = await import(serverPath);
    const render = serverModule.render || serverModule.default?.render;
    
    if (!render) {
      throw new Error('Render function not found in server module');
    }
    
    // Render the app server-side
    const rendered = await render(url);
    
    // Replace the SSR outlet with rendered content
    const html = template.replace('<!--ssr-outlet-->', rendered.html);

    // Set appropriate headers for SSR
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    // Send the rendered HTML
    res.status(200).send(html);
  } catch (error) {
    console.error('SSR Error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Fallback: serve the template without SSR
    try {
      const templatePath = path.join(process.cwd(), 'dist/client/index.html');
      const template = await fs.readFile(templatePath, 'utf-8');
      
      // Replace SSR outlet with empty div to prevent hydration issues
      const fallbackHtml = template.replace('<!--ssr-outlet-->', '<div id="root"></div>');
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-SSR-Fallback', 'true');
      res.status(200).send(fallbackHtml);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      
      // Last resort: basic HTML
      const basicHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epitome IAS Academy</title>
</head>
<body>
    <div id="root"></div>
    <script>
        console.error('SSR failed, falling back to client-side rendering');
        // This will be handled by client-side hydration
    </script>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-SSR-Error', 'true');
      res.status(200).send(basicHtml);
    }
  }
}