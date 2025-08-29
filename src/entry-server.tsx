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

import {
  getCustomPageBySlugServer,
  getPublishedCustomPagesServer
} from './services/pageService-server';

import {
  getCoursesServer,
  getCourseByIdServer,
  getCoursesByExamTypeServer
} from './services/courseService-server';

import {
  getQuizzesServer,
  getQuizByIdServer,
  getQuizzesByTypeServer,
  getQuizzesByExamBoardServer
} from './services/quizService-server';

import {
  getCurrentAffairsByDateServer,
  getCurrentAffairsBySlugServer,
  getCurrentAffairsDatesServer
} from './services/currentAffairsService-server';

export async function render(url: string) {
  try {
    console.log('SSR: Starting render for URL:', url);
    
    let initialData = null;
    
    // Handle blog routes
    if (url.startsWith('/blogs/')) {
      const slug = url.split('/blogs/')[1];
      console.log('SSR: Processing blog route with slug:', slug);
      
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
            slug,
            pageType: 'blog'
          };
        }
      } catch (error) {
        console.error('SSR: Error fetching blog data:', error);
      }
    }
    
    // Handle notes routes
    else if (url.startsWith('/notes/')) {
      const slug = url.split('/notes/')[1];
      console.log('SSR: Processing notes route with slug:', slug);
      
      try {
        const post = await getBlogPostBySlugServer(slug);
        const categories = await getCategoriesServer();
        const allPosts = await getPublishedPostsServer();
        
        if (post) {
          initialData = {
            post,
            categories,
            allPosts,
            slug,
            pageType: 'notes'
          };
        }
      } catch (error) {
        console.error('SSR: Error fetching notes data:', error);
      }
    }
    
    // Handle current affairs routes
    else if (url.startsWith('/current-affairs/')) {
      const pathParts = url.split('/current-affairs/')[1].split('/');
      const examType = pathParts[0]; // upsc, tgpsc, appsc
      
      if (pathParts.length === 2) {
        // /current-affairs/upsc/:dateParam
        const dateParam = pathParts[1];
        console.log('SSR: Processing current affairs date route:', examType, dateParam);
        
        try {
          const posts = await getCurrentAffairsByDateServer(dateParam, examType);
          const dates = await getCurrentAffairsDatesServer(examType);
          
          initialData = {
            posts,
            dates,
            examType,
            dateParam,
            pageType: 'currentAffairsDate'
          };
        } catch (error) {
          console.error('SSR: Error fetching current affairs date data:', error);
        }
      } else if (pathParts.length === 3) {
        // /current-affairs/upsc/:dateParam/:slug
        const dateParam = pathParts[1];
        const slug = pathParts[2];
        console.log('SSR: Processing current affairs post route:', examType, dateParam, slug);
        
        try {
          const post = await getCurrentAffairsBySlugServer(dateParam, slug, examType);
          const dates = await getCurrentAffairsDatesServer(examType);
          
          if (post) {
            initialData = {
              post,
              dates,
              examType,
              dateParam,
              slug,
              pageType: 'currentAffairsPost'
            };
          }
        } catch (error) {
          console.error('SSR: Error fetching current affairs post data:', error);
        }
      } else {
        // /current-affairs (main page)
        console.log('SSR: Processing current affairs main page');
        
        try {
          const upscDates = await getCurrentAffairsDatesServer('upsc');
          const tgpscDates = await getCurrentAffairsDatesServer('tgpsc');
          const appscDates = await getCurrentAffairsDatesServer('appsc');
          
          initialData = {
            upscDates,
            tgpscDates,
            appscDates,
            pageType: 'currentAffairsMain'
          };
        } catch (error) {
          console.error('SSR: Error fetching current affairs main data:', error);
        }
      }
    }
    
    // Handle courses route
    else if (url === '/courses') {
      console.log('SSR: Processing courses page');
      
      try {
        const courses = await getCoursesServer();
        
        initialData = {
          courses,
          pageType: 'courses'
        };
      } catch (error) {
        console.error('SSR: Error fetching courses data:', error);
      }
    }
    
    // Handle quizzes route
    else if (url === '/quizzes') {
      console.log('SSR: Processing quizzes page');
      
      try {
        const quizzes = await getQuizzesServer();
        
        initialData = {
          quizzes,
          pageType: 'quizzes'
        };
      } catch (error) {
        console.error('SSR: Error fetching quizzes data:', error);
      }
    }
    
    // Handle specific quiz route
    else if (url.startsWith('/quiz/')) {
      const quizId = url.split('/quiz/')[1];
      console.log('SSR: Processing quiz page with ID:', quizId);
      
      try {
        const quiz = await getQuizByIdServer(quizId);
        
        if (quiz) {
          initialData = {
            quiz,
            pageType: 'quiz'
          };
        }
      } catch (error) {
        console.error('SSR: Error fetching quiz data:', error);
      }
    }
    
    // Handle PYQs routes
    else if (url.startsWith('/pyqs/')) {
      console.log('SSR: Processing PYQs page');
      
      try {
        const quizzes = await getQuizzesServer();
        
        initialData = {
          quizzes,
          pageType: 'pyqs'
        };
      } catch (error) {
        console.error('SSR: Error fetching PYQs data:', error);
      }
    }
    
    // Handle exam-specific notes routes
    else if (url.match(/^\/(upsc|tgpsc|appsc)-notes$/)) {
      const examType = url.split('-')[0];
      console.log('SSR: Processing exam notes page for:', examType);
      
      try {
        const page = await getCustomPageBySlugServer(`${examType}-notes`);
        
        if (page) {
          initialData = {
            page,
            examType,
            pageType: 'examNotes'
          };
        }
      } catch (error) {
        console.error('SSR: Error fetching exam notes data:', error);
      }
    }
    
    // Handle custom pages at root level
    else if (url !== '/' && !url.startsWith('/admin') && !url.startsWith('/login') && !url.startsWith('/profile')) {
      const slug = url.substring(1); // Remove leading slash
      console.log('SSR: Processing custom page with slug:', slug);
      
      try {
        const page = await getCustomPageBySlugServer(slug);
        
        if (page) {
          initialData = {
            page,
            slug,
            pageType: 'customPage'
          };
        }
      } catch (error) {
        console.error('SSR: Error fetching custom page data:', error);
      }
    }
    
    // Handle homepage with general data
    else if (url === '/') {
      console.log('SSR: Processing homepage');
      
      try {
        const categories = await getCategoriesServer();
        const recentPosts = await getPublishedPostsServer();
        const courses = await getCoursesServer();
        
        initialData = {
          categories,
          recentPosts: recentPosts.slice(0, 6), // Limit to 6 recent posts
          courses: courses.slice(0, 6), // Limit to 6 recent courses
          pageType: 'homepage'
        };
      } catch (error) {
        console.error('SSR: Error fetching homepage data:', error);
      }
    }
    
    console.log('SSR: Initial data prepared:', initialData ? Object.keys(initialData) : 'none');
    
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