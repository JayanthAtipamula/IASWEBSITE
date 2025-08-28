import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getCustomPageBySlug } from '../services/pageService';
import { getCategories, getPublishedPosts, getBlogPostBySlug } from '../services/blogService';
import { CustomPage } from '../types/page';
import { BlogPost as BlogPostType, Category } from '../types/blog';
import LoadingScreen from '../components/LoadingScreen';
import BlogPostComponent from './blog/BlogPost';

// List of known base routes that should not be treated as custom pages
const KNOWN_ROUTES = [
  'upsc-notes',
  'appsc-notes', 
  'tgpsc-notes', 
  'notes', 
  'quizzes', 
  'quiz', 
  'login', 
  'profile', 
  'category', 
  'admin', 
  'pages',
  'courses',
  'blogs'
];

// Function to update meta tags
const updateMetaTags = (title: string, description: string, imageUrl?: string) => {
  if (typeof document === 'undefined') return;
  
  // Update document title
  document.title = `${title} | Epitome IAS`;
  
  // Find or create meta description tag
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);
  
  // Find or create og:title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);
  
  // Find or create og:description
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', description);
  
  // Find or create og:image if imageUrl exists
  if (imageUrl) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', imageUrl);
  }
};

interface CustomPageViewProps {
  isExamPage?: 'upsc' | 'appsc' | 'tgpsc';
}

const CustomPageView: React.FC<CustomPageViewProps> = ({ isExamPage }) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPostType | null>(null);
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/');
  const [contentType, setContentType] = useState<'custom' | 'blog' | 'none' | 'exam'>('none');
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Handle exam-specific pages directly
        if (isExamPage) {
          // Set page title based on exam type
          let title = '';
          let pageSlug = '';
          if (isExamPage === 'upsc') {
            title = 'UPSC Notes';
            pageSlug = 'upsc-notes';
          } else if (isExamPage === 'appsc') {
            title = 'APPSC Notes';
            pageSlug = 'appsc-notes';
          } else if (isExamPage === 'tgpsc') {
            title = 'TGPSC Notes';
            pageSlug = 'tgpsc-notes';
          }
          setPageTitle(title);
          
          // Try to fetch a custom page with this slug first, then fall back to showing all
          const [customPageData, postsData, categoriesData] = await Promise.all([
            getCustomPageBySlug(pageSlug).catch(err => {
              console.log(`No custom page found for ${pageSlug}:`, err);
              return null;
            }),
            getPublishedPosts(),
            getCategories()
          ]);
          
          console.log(`Exam page custom page data:`, customPageData);
          
          setPosts(postsData);
          setCategories(categoriesData);
          
          // If we found a custom page for this exam, use its categories
          if (customPageData) {
            setPage(customPageData);
            setContentType('custom');
            console.log(`Found custom page for ${pageSlug} with categories:`, customPageData.categories);
          } else {
            setContentType('exam');
            console.log(`No custom page found for ${pageSlug}, showing all categories`);
          }
          
          // Update meta tags for exam page
          updateMetaTags(
            title,
            `Study material and notes for ${title}`
          );
          
          setLoading(false);
          return;
        }

        // Regular custom page handling
        if (!slug) {
          throw new Error('Page slug is required');
        }

        console.log(`Fetching data for slug: ${slug}`);

        // Check if this is a known route that should not be treated as a custom page
        if (KNOWN_ROUTES.includes(slug)) {
          console.log(`${slug} is a known route, redirecting`);
          setShouldRedirect(true);
          return;
        }

        // Fetch data in parallel
        const [customPageData, blogPostData, postsData, categoriesData] = await Promise.all([
          getCustomPageBySlug(slug).catch(err => {
            console.log(`Error fetching custom page: ${err}`);
            return null;
          }),
          getBlogPostBySlug(slug).catch(err => {
            console.log(`Error fetching blog post: ${err}`);
            return null;
          }),
          getPublishedPosts(),
          getCategories()
        ]);

        console.log(`Custom page data: ${customPageData ? 'found' : 'not found'}`);
        console.log(`Blog post data: ${blogPostData ? 'found' : 'not found'}`);

        // Set available data
        setPage(customPageData);
        setBlogPost(blogPostData);
        setPosts(postsData);
        setCategories(categoriesData);
        
        // Determine what type of content we have
        if (customPageData) {
          console.log('Setting content type to custom');
          setContentType('custom');
          
          // Update meta tags for custom page
          updateMetaTags(
            customPageData.title,
            customPageData.description || 'Explore this custom page from Epitome IAS'
          );
        } else if (blogPostData) {
          console.log('Setting content type to blog');
          setContentType('blog');
          // Note: Blog post meta tags are handled in the BlogPost component
        } else {
          console.log('No content found, redirecting to home');
          setShouldRedirect(true);
          setRedirectPath('/');
          return;
        }

        setError(null);
      } catch (err) {
        console.error('Error loading content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    // Reset states when slug changes
    setPage(null);
    setBlogPost(null);
    setContentType('none');
    setShouldRedirect(false);
    setError(null);
    
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [isClient, slug, location.pathname, isExamPage]);

  // Cleanup function to reset meta tags when component unmounts
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.title = 'Epitome IAS';
        
        // Reset meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', 'Epitome IAS - Your learning partner for UPSC, TGPSC and APPSC competitive exams.');
        }
        
        // Reset og tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', 'Epitome IAS');
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', 'Epitome IAS - Your learning partner for competitive exams.');
        }
      }
    };
  }, []);

  // Function to get posts for a specific category
  const getPostsByCategory = (categoryId: string) => {
    return posts.filter(post => post.categories.includes(categoryId));
  };

  // Function to get random number of posts between 10-15 or all if less
  const getRandomPostsForCategory = (categoryId: string) => {
    const categoryPosts = getPostsByCategory(categoryId);
    const maxPosts = Math.min(categoryPosts.length, Math.floor(Math.random() * 6) + 10); // Random between 10-15
    return categoryPosts.slice(0, maxPosts);
  };

  // Get the filtered categories based on content type
  const getFilteredCategories = () => {
    if (contentType === 'custom' && page) {
      console.log('Custom page categories:', page.categories);
      console.log('Available categories:', categories.map(c => ({id: c.id, name: c.name})));
      
      // Check which categories have posts
      const categoriesWithPostCounts = page.categories.map(catId => {
        const category = categories.find(c => c.id === catId);
        const postCount = posts.filter(p => p.categories.includes(catId)).length;
        return {
          id: catId,
          name: category?.name || 'Unknown',
          postCount
        };
      });
      
      console.log('Categories with post counts:', categoriesWithPostCounts);
      
      // For custom pages, we filter by the categories array in the page
      // Include all selected categories even if they don't have posts
      return categories.filter(category => 
        page.categories.includes(category.id)
      );
    } else if (contentType === 'exam' && isExamPage) {
      console.log('Exam page type:', isExamPage);
      console.log('All categories:', categories.map(c => ({id: c.id, name: c.name})));
      console.log('All posts:', posts.length);
      console.log('Posts by category:', categories.map(c => ({
        category: c.name, 
        postCount: posts.filter(p => p.categories.includes(c.id)).length
      })));
      
      // Show all categories that have at least one post
      return categories.filter(category => 
        posts.some(post => post.categories.includes(category.id))
      );
    }
    
    return [];
  };
  
  const filteredCategories = getFilteredCategories();

  if (shouldRedirect) {
    console.log(`Redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Don't show loading screen during SSR, only on client side
  if (loading && isClient) {
    return <LoadingScreen />;
  }

  // If it's a blog post, render the blog post component
  if (contentType === 'blog' && blogPost) {
    return <BlogPostComponent />;
  }

  if (error || (contentType === 'none' && !isExamPage)) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="font-medium">Error!</div>
          <div>{error || 'Page not found'}</div>
          <div className="mt-3">
            <Link to="/" className="text-red-700 underline">
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render custom page or exam page
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {contentType === 'exam' ? pageTitle : page?.title}
      </h1>
      
      {(contentType === 'custom' && page?.description) && (
        <p className="text-lg text-gray-600 mb-8">{page.description}</p>
      )}
      
      {filteredCategories.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredCategories.map((category) => {
            const categoryPosts = getPostsByCategory(category.id);
            const displayPosts = getRandomPostsForCategory(category.id);
            
            return (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 break-inside-avoid-column hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4 flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                </div>
                
                <div className="p-5">
                  {categoryPosts.length > 0 ? (
                    <Link
                      to={`/${categoryPosts[0].slug}`}
                      className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
                    >
                      Explore More
                    </Link>
                  ) : (
                    <p className="text-gray-500 italic">No posts available in this category yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-600">No categories found</h2>
          <p className="mt-4">
            {contentType === 'exam' 
              ? `Please create categories and assign posts to them for ${pageTitle}` 
              : `This page (${page?.title || slug}) exists but has no categories assigned to it. Please edit it in the admin panel to add categories.`}
          </p>
          {isExamPage && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto text-left">
              <h3 className="font-medium mb-2">How to fix this:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Go to Admin Panel → Custom Pages</li>
                <li>Create a new page with the slug "{isExamPage === 'upsc' ? 'upsc-notes' : isExamPage === 'appsc' ? 'appsc-notes' : 'tgpsc-notes'}"</li>
                <li>Assign relevant categories to this page</li>
                <li>Make sure these categories have posts assigned to them</li>
                <li>Publish the page</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CustomPageView.defaultProps = {
  isExamPage: undefined
};

export default CustomPageView; 