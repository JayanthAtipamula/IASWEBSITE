import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.tsx';

// Import server-side services
import { 
  getBlogPostBySlugServer, 
  getCategoriesServer, 
  getPublishedPostsServer, 
  getCurrentAffairsPostsServer 
} from './services/blogService-server';

export async function render(url: string) {
  try {

    
    // Extract slug from blog URLs
    let initialData = null;
    if (url.startsWith('/blogs/')) {
      const slug = url.split('/blogs/')[1];
      
      try {
        const post = await getBlogPostBySlugServer(slug);
        const categories = await getCategoriesServer();
        const allPosts = await getPublishedPostsServer();
        const currentAffairs = await getCurrentAffairsPostsServer();
        
        if (post) {
          initialData = {
            post,
            categories,
            allPosts,
            currentAffairs,
            slug
          };
        }
      } catch (error) {
        console.error('SSR: Error fetching blog data:', error);
        console.error('SSR: Error stack:', error.stack);
      }
    }
    
    const html = renderToString(
      <StrictMode>
        <StaticRouter location={url}>
          <App initialData={initialData} />
        </StaticRouter>
      </StrictMode>
    );
    

    return { html, initialData };
  } catch (error) {
    console.error('SSR: Render failed:', error);
    // Return a fallback HTML if rendering fails
    return {
      html: `
        <div id="root">
          <h1>Loading...</h1>
          <p>Please wait while the page loads.</p>
        </div>
      `,
      initialData: null
    };
  }
}