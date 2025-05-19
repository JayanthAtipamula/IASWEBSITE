import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getBlogPostBySlug, getCategories, getPublishedPosts, getCurrentAffairsPosts } from '../../services/blogService';
import { BlogPost as BlogPostType, Category } from '../../types/blog';
import { ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

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

interface BlogPostProps {
  isCurrentAffair?: boolean;
  examType?: 'upsc' | 'tgpsc' | 'appsc';
}

const BlogPost: React.FC<BlogPostProps> = ({ isCurrentAffair: isCurrentAffairProp, examType: examTypeProp }) => {
  const { slug, dateParam } = useParams<{ slug: string; dateParam?: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        // Add a small delay to show loading animation
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

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
  }, [slug, isCurrentAffairProp, examTypeProp, dateParam]);

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

  if (loading) {
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
      <div className="lg:flex lg:gap-8">
        {/* Left Sidebar - Categories or Current Affairs */}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
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
        
        {/* Main Content */}
        <div className="lg:w-3/4">
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
              {isCurrentAffairProp && examTypeProp ? (
                <Link to={`/current-affairs/${examTypeProp}`} className="text-blue-600 hover:text-blue-800">
                  {examTypeProp.toUpperCase()} Current Affairs
                </Link>
              ) : (
                <Link to="/notes" className="text-blue-600 hover:text-blue-800">
                  Notes
                </Link>
              )}
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex items-center space-x-3 text-sm text-gray-500 mb-6">
                {isCurrentAffair && post.currentAffairDate && (
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    <time dateTime={new Date(post.currentAffairDate).toISOString()}>
                      {formatDate(post.currentAffairDate)}
                    </time>
                  </div>
                )}
                {!isCurrentAffair && (
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                )}
                <span>•</span>
                <span>{post.author}</span>
              </div>

              {!isCurrentAffair && post.categories.length > 0 && (
                <div className="mb-8">
                  {post.categories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <span
                        key={category.id}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2"
                      >
                        {category.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              <div className="prose prose-blue md:prose-lg lg:prose-xl max-w-none">
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
          
          {/* Mobile sidebar (visible only on mobile) */}
          <div className="mt-8 lg:hidden">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
                  <div className="space-y-2">
                    {categories.map((category) => (
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
