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
  'notes', 
  'quizzes', 
  'quiz', 
  'login', 
  'profile', 
  'category', 
  'admin', 
  'pages',
  'courses'
];

// Function to update meta tags
const updateMetaTags = (title: string, description: string, imageUrl?: string) => {
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

const CustomPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPostType | null>(null);
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/');
  const [contentType, setContentType] = useState<'custom' | 'blog' | 'none'>('none');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
    
    fetchData();
    
    // Cleanup function to reset meta tags when component unmounts
    return () => {
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
    };
  }, [slug, location.pathname]);

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

  // Get only the categories that are selected for this page
  const filteredCategories = categories.filter(category => 
    page?.categories?.includes(category.id)
  );

  if (shouldRedirect) {
    console.log(`Redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  // If it's a blog post, render the blog post component
  if (contentType === 'blog' && blogPost) {
    return <BlogPostComponent />;
  }

  if (error || contentType === 'none' || !page) {
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

  // Render custom page
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
      
      {page.description && (
        <p className="text-lg text-gray-600 mb-8">{page.description}</p>
      )}
      
      {page.categories && page.categories.length > 0 ? (
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
                  <div className="mr-2 text-blue-500 text-2xl font-bold">{categoryPosts.length}</div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                </div>
                
                <div className="p-5">
                  <ul className="space-y-1 mb-6">
                    {displayPosts.map((post) => (
                      <li key={post.id} className="py-1">
                        <Link 
                          to={`/${post.slug}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-start"
                        >
                          <span className="text-xs text-gray-500 mr-2 mt-1">•</span>
                          <span>{post.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
                  >
                    Explore More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div 
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6"
          dangerouslySetInnerHTML={{ __html: page.content || '' }}
        />
      )}

      {page.categories && filteredCategories.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No categories found for this page.</p>
        </div>
      )}
    </div>
  );
};

export default CustomPageView; 