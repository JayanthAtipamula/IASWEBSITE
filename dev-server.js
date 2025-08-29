import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';

async function createServer() {
  const app = express();

  // Add compression middleware
  app.use(compression());

  // Create Vite server in middleware mode and configure the app type as 'custom'
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  app.use(vite.middlewares);

  // Test Firebase Admin connection (using Vite's module loading)
  app.get('/test-firebase', async (req, res) => {
    try {
      const { adminDb } = await vite.ssrLoadModule('./src/config/firebase-admin.ts');
      const postsRef = adminDb.collection('posts');
      const snapshot = await postsRef.limit(1).get();
      
      res.json({
        success: true,
        message: 'Firebase Admin is working',
        postsCount: snapshot.size,
        hasPosts: !snapshot.empty
      });
    } catch (error) {
      console.error('Firebase Admin test error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Test blog data fetching (using Vite's module loading)
  app.get('/test-blog/:slug', async (req, res) => {
    try {
      const { getBlogPostBySlugServer } = await vite.ssrLoadModule('./src/services/blogService-server.ts');
      const post = await getBlogPostBySlugServer(req.params.slug);
      
      res.json({
        success: true,
        slug: req.params.slug,
        postFound: !!post,
        post: post ? {
          id: post.id,
          title: post.title,
          slug: post.slug,
          published: post.published
        } : null
      });
    } catch (error) {
      console.error('Blog test error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    console.log(`SSR Request: ${url}`);

    try {
      // Always read fresh template in development
      console.log('Reading template...');
      let template = await fs.readFile('./index.html', 'utf-8');
      console.log('Template loaded, transforming...');
      template = await vite.transformIndexHtml(url, template);
      console.log('Loading entry-server...');
      const render = (await vite.ssrLoadModule('./src/entry-server.tsx')).render;
      console.log('Entry server loaded successfully');

      console.log('Rendering...');
      const rendered = await render(url);
      console.log('Rendering complete, HTML length:', rendered.html.length);
      
      let html = template.replace('<!--ssr-outlet-->', rendered.html);
      console.log('HTML replacement complete, final length:', html.length);
      
      // Inject initial data into the HTML for hydration
      if (rendered.initialData) {
        const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(rendered.initialData)};</script>`;
        html = html.replace('</head>', `${dataScript}</head>`);
        console.log('Initial data injected for hydration');
        console.log('Data script length:', dataScript.length);
        console.log('Data preview:', JSON.stringify(rendered.initialData).substring(0, 200) + '...');
      } else {
        console.log('No initial data to inject');
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error('SSR Error:', e);
      console.error('Error stack:', e.stack);
      vite.ssrFixStacktrace(e);
      
      res.status(500).send(`
        <h1>SSR Error</h1>
        <pre>${e.stack}</pre>
        <p>URL: ${url}</p>
        <p>Error message: ${e.message}</p>
      `);
    }
  });

  return app;
}

// Start the development server
createServer().then(app => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Development server running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start development server:', error);
});

