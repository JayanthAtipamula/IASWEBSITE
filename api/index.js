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

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    
    // Send the rendered HTML
    res.status(200).send(html);
  } catch (error) {
    console.error('SSR Error:', error);
    
    // Fallback: serve the template without SSR
    try {
      const templatePath = resolve(__dirname, '../dist/client/index.html');
      const template = await fs.readFile(templatePath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(template);
    } catch (fallbackError) {
      res.status(500).send('Server Error');
    }
  }
}