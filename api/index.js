import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  const url = req.url;

  try {
    // Read the built HTML template
    const templatePath = resolve(__dirname, '../dist/client/index.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    
    // Import the server-side render function
    const { render } = await import('../dist/server/entry-server.js');
    
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
      const templatePath = resolve(__dirname, '../dist/client/index.html');
      const template = await fs.readFile(templatePath, 'utf-8');
      
      // Replace SSR outlet with empty div to prevent hydration issues
      const fallbackHtml = template.replace('<!--ssr-outlet-->', '<div id="root"></div>');
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-SSR-Fallback', 'true');
      res.status(200).send(fallbackHtml);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      res.status(500).send('<!DOCTYPE html><html><head><title>Server Error</title></head><body><h1>500 - Server Error</h1><p>Unable to render page</p></body></html>');
    }
  }
}