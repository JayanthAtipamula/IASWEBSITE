import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';

const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // Add compression middleware
  app.use(compression());

  // Test endpoints will be defined after Vite is initialized

  let vite;
  if (!isProduction) {
    // Create Vite server in middleware mode and configure the app type as 'custom'
    vite = await createViteServer({
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

    // Test custom page data fetching
    app.get('/test-custom-page/:slug', async (req, res) => {
      try {
        const { getCustomPageBySlugServer } = await vite.ssrLoadModule('./src/services/pageService-server.ts');
        const page = await getCustomPageBySlugServer(req.params.slug);
        
        res.json({
          success: true,
          slug: req.params.slug,
          pageFound: !!page,
          page: page ? {
            id: page.id,
            title: page.title,
            slug: page.slug,
            published: page.published
          } : null
        });
      } catch (error) {
        console.error('Custom page test error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Test database collections
    app.get('/test-collections', async (req, res) => {
      try {
        const { adminDb } = await vite.ssrLoadModule('./src/config/firebase-admin.ts');
        
        // Check custom_pages collection
        const customPagesRef = adminDb.collection('custom_pages');
        const customPagesSnapshot = await customPagesRef.limit(5).get();
        
        // Check posts collection
        const postsRef = adminDb.collection('posts');
        const postsSnapshot = await postsRef.limit(5).get();
        
        res.json({
          success: true,
          customPages: {
            count: customPagesSnapshot.size,
            samples: customPagesSnapshot.docs.map(doc => ({
              id: doc.id,
              title: doc.data().title,
              slug: doc.data().slug,
              published: doc.data().published
            }))
          },
          posts: {
            count: postsSnapshot.size,
            samples: postsSnapshot.docs.map(doc => ({
              id: doc.id,
              title: doc.data().title,
              slug: doc.data().slug,
              published: doc.data().published
            }))
          }
        });
      } catch (error) {
        console.error('Collections test error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  } else {
    // In production, use the built assets
    const { default: sirv } = await import('sirv');
    app.use(sirv('dist/client', { extensions: [] }));
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    console.log(`SSR Request: ${url}`);

    try {
      let template, render;

      if (!isProduction) {
        // Always read fresh template in development
        console.log('Reading template...');
        template = await fs.readFile('./index.html', 'utf-8');
        console.log('Template loaded, transforming...');
        template = await vite.transformIndexHtml(url, template);
        console.log('Loading entry-server...');
        render = (await vite.ssrLoadModule('./src/entry-server.tsx')).render;
        console.log('Entry server loaded successfully');
      } else {
        template = await fs.readFile('./dist/client/index.html', 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

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
      if (vite) {
        vite.ssrFixStacktrace(e);
      }
      // In development, show error details
      if (!isProduction) {
        res.status(500).send(`
          <h1>SSR Error</h1>
          <pre>${e.stack}</pre>
          <p>URL: ${url}</p>
          <p>Error message: ${e.message}</p>
        `);
      } else {
        next(e);
      }
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