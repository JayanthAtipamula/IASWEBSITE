import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';

const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // Add compression middleware
  app.use(compression());

  let vite;
  if (!isProduction) {
    // Create Vite server in middleware mode and configure the app type as 'custom'
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });

    app.use(vite.middlewares);
  } else {
    // In production, use the built assets
    const { default: sirv } = await import('sirv');
    app.use(sirv('dist/client', { extensions: [] }));
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template, render;

      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile('./index.html', 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('./src/entry-server.tsx')).render;
      } else {
        template = await fs.readFile('./dist/client/index.html', 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      const rendered = await render(url);
      const html = template.replace('<!--ssr-outlet-->', rendered.html);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  return app;
}

const port = process.env.PORT || 3000;
createServer().then(app => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});