import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getBlogPostBySlug, getCategories, getPublishedPosts, getCurrentAffairsPosts } from '../../services/blogService';
import { BlogPost as BlogPostType, Category } from '../../types/blog';
import { ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

// Function to update meta tags - SSR compatible
const updateMetaTags = (title: string, description: string, imageUrl?: string) => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
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

interface BlogPostProps {
  isCurrentAffair?: boolean;
  isBlog?: boolean;
  examType?: 'upsc' | 'tgpsc' | 'appsc';
  initialData?: any;
}

const BlogPost: React.FC<BlogPostProps> = ({ isCurrentAffair: isCurrentAffairProp, isBlog: isBlogProp, examType: examTypeProp, initialData }) => {
  const { slug, dateParam } = useParams<{ slug: string; dateParam?: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);



  useEffect(() => {
    setIsClient(true);
    
    // Use initial data from SSR if available
    if (initialData && initialData.post) {
      
      setPost(initialData.post);
      setCategories(initialData.categories || []);
      setAllPosts(initialData.allPosts || []);
      setCurrentAffairs(initialData.currentAffairs || []);
      
      // Initialize expanded state for the categories
      if (initialData.post.categories) {
        const initialExpandedState: Record<string, boolean> = {};
        initialData.post.categories.forEach((catId: string) => {
          initialExpandedState[catId] = true;
        });
        setExpandedCategories(initialExpandedState);
      }
      
      // Update meta tags
      updateMetaTags(
        initialData.post.title,
        initialData.post.excerpt || 'Read this informative article from Epitome IAS',
        initialData.post.featuredImage
      );
      
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        if (!slug) return;
        
        // If we're viewing a current affair with a specific exam type
        if (isCurrentAffairProp && examTypeProp && dateParam) {
          console.log(`Fetching current affair article: ${slug} for exam ${examTypeProp} on date ${dateParam}`);
          
          // For current affairs with dateParam, we can fetch directly using the slug
          const [post, categoriesResult, currentAffairsData] = await Promise.all([
            getBlogPostBySlug(slug),
            getCategories(),
            getCurrentAffairsPosts()
          ]);
          
          if (post) {
            setPost(post);
            setCategories(categoriesResult);
            setAllPosts([]);
            setCurrentAffairs(currentAffairsData);
            
            // Initialize expanded state for the categories
            const initialExpandedState: Record<string, boolean> = {};
            post.categories.forEach((catId: string) => {
              initialExpandedState[catId] = true;
            });
            setExpandedCategories(initialExpandedState);
            
            // Update meta tags
            updateMetaTags(
              post.title,
              post.excerpt || 'Read this informative article from Epitome IAS',
              post.featuredImage
            );
          }
        } else {
          // Regular blog post fetch
          const [post, categoriesResult, postsData, currentAffairsData] = await Promise.all([
            getBlogPostBySlug(slug),
            getCategories(),
            getPublishedPosts(),
            getCurrentAffairsPosts()
          ]);
          
          if (post) {
            setPost(post);
            setCategories(categoriesResult);
            setAllPosts(postsData);
            setCurrentAffairs(currentAffairsData);
            
            // Initialize expanded state for the categories
            const initialExpandedState: Record<string, boolean> = {};
            post.categories.forEach((catId: string) => {
              initialExpandedState[catId] = true;
            });
            setExpandedCategories(initialExpandedState);
            
            // Update meta tags
            updateMetaTags(
              post.title,
              post.excerpt || 'Read this informative article from Epitome IAS',
              post.featuredImage
            );
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [isClient, slug, isCurrentAffairProp, examTypeProp, dateParam]);

  // Cleanup function to reset meta tags when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
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

  // Handle scroll to hide/show floating button
  useEffect(() => {
    if (!isClient) return;

    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [isClient]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getPostsByCategory = (categoryId: string) => {
    return allPosts.filter(p => p.categories.includes(categoryId));
  };

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'Date not available';
    return format(new Date(timestamp), 'dd MMMM yyyy');
  };

  // Show loading screen only on client side after hydration
  if (loading && isClient) {
    return <LoadingScreen />;
  }

  if (!post) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-8">The note you're looking for doesn't exist.</p>
          <Link
            to="/notes"
            className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
          >
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentAffair = isCurrentAffairProp || post?.isCurrentAffair || false;
  
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className={`${(isBlogProp || post.isBlog) ? 'flex justify-center' : 'lg:flex lg:gap-8'}`}>
        {/* Left Sidebar - Categories or Current Affairs - Only show for non-blog posts */}
        {!(isBlogProp || post.isBlog) && (
          <div className="hidden lg:block lg:w-1/4">
            {isCurrentAffair ? (
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Affairs</h2>
                <div className="space-y-2">
                  {currentAffairs.map((affair) => (
                    <Link 
                      key={affair.id}
                      to={affair.examType ? 
                        `/current-affairs/${affair.examType}/${affair.currentAffairDate}/${affair.slug}` : 
                        `/notes/${affair.slug}`
                      }
                      className={`block p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors ${
                        affair.id === post.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span>{formatDate(affair.currentAffairDate)}</span>
                      </div>
                      <h3 className={`text-sm font-medium ${
                        affair.id === post.id ? 'text-blue-600' : 'text-gray-800'
                      }`}>
                        {affair.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 sticky top-24">
                <div className="space-y-2">
                  {categories
                    .filter(category => post.categories.includes(category.id))
                    .map((category) => (
                    <div key={category.id} className="border-b border-gray-100 pb-2">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center justify-between w-full text-left px-2 py-2 rounded-md hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-800">{category.name}</span>
                        {expandedCategories[category.id] ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedCategories[category.id] && (
                        <div className="mt-1 ml-4 space-y-1">
                          {getPostsByCategory(category.id).map((categoryPost) => (
                            <Link
                              key={categoryPost.id}
                              to={`/notes/${categoryPost.slug}`}
                              className={`block py-1 text-sm ${
                                categoryPost.id === post.id
                                  ? 'text-blue-600 font-medium'
                                  : 'text-gray-600 hover:text-blue-600'
                              }`}
                            >
                              {categoryPost.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Main Content */}
        <div className={`${(isBlogProp || post.isBlog) ? 'max-w-4xl w-full' : 'lg:w-3/4'}`}>
          <article className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {post.featuredImage && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="p-6 md:p-8 lg:p-10">
              {/* Breadcrumb at top */}
              <div className="mb-6">
                {isCurrentAffairProp && examTypeProp ? (
                  <Link to={`/current-affairs/${examTypeProp}`} className="text-blue-600 hover:text-blue-800">
                    {examTypeProp.toUpperCase()} Current Affairs
                  </Link>
                ) : isBlogProp || post.isBlog ? (
                  <Link to="/blogs" className="text-blue-600 hover:text-blue-800">
                    Blog
                  </Link>
                ) : (
                  <Link to="/notes" className="text-blue-600 hover:text-blue-800">
                    {post.categories.length > 0 
                      ? categories.find(c => c.id === post.categories[0])?.name || 'Notes'
                      : 'Notes'
                    }
                  </Link>
                )}
              </div>
              
              {/* Main title prominently displayed */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">{post.title}</h1>

              {/* Content */}
              <div className="prose prose-blue md:prose-lg lg:prose-xl max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>



              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-3">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
          
          {/* Mobile sidebar (sliding side menu) */}
          {!(isBlogProp || post.isBlog) && (
            <>
              {/* Backdrop overlay */}
              {mobileSidebarOpen && (
                <div 
                  className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setMobileSidebarOpen(false)}
                />
              )}
              
              {/* Mobile sidebar */}
              <div className={`lg:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-lg border-r border-gray-200 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}>
                <div className="p-4 pt-24">
                  {/* Close button */}
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {isCurrentAffair ? (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Affairs</h2>
                      <div className="space-y-3">
                        {currentAffairs.map((affair) => (
                          <Link 
                            key={affair.id}
                            to={affair.examType ? 
                              `/current-affairs/${affair.examType}/${affair.currentAffairDate}/${affair.slug}` : 
                              `/notes/${affair.slug}`
                            }
                            className={`block p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors ${
                              affair.id === post.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                            onClick={() => setMobileSidebarOpen(false)}
                          >
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              <span>{formatDate(affair.currentAffairDate)}</span>
                            </div>
                            <h3 className={`text-sm font-medium ${
                              affair.id === post.id ? 'text-blue-600' : 'text-gray-800'
                            }`}>
                              {affair.title}
                            </h3>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {categories
                          .filter(category => post.categories.includes(category.id))
                          .map((category) => (
                          <div key={category.id} className="border-b border-gray-100 pb-2">
                            <button
                              onClick={() => toggleCategory(category.id)}
                              className="flex items-center justify-between w-full text-left px-2 py-2 rounded-md hover:bg-gray-50"
                            >
                              <span className="font-medium text-gray-800">{category.name}</span>
                              {expandedCategories[category.id] ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                            
                            {expandedCategories[category.id] && (
                              <div className="mt-1 ml-4 space-y-1">
                                {getPostsByCategory(category.id).map((categoryPost) => (
                                  <Link
                                    key={categoryPost.id}
                                    to={`/notes/${categoryPost.slug}`}
                                    className={`block py-1 text-sm ${
                                      categoryPost.id === post.id
                                        ? 'text-blue-600 font-medium'
                                        : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                    onClick={() => setMobileSidebarOpen(false)}
                                  >
                                    {categoryPost.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Floating action button to open mobile sidebar */}
          {!(isBlogProp || post.isBlog) && (
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={`lg:hidden fixed top-1/2 left-6 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${
                isScrolling ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={mobileSidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
