import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getCategories, getPublishedPosts } from '../../services/blogService';
import { BlogPost as BlogPostType, Category } from '../../types/blog';
import { ChevronDown, ChevronUp } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;
        const [postData, categoriesData, postsData] = await Promise.all([
          getBlogPostBySlug(slug),
          getCategories(),
          getPublishedPosts()
        ]);
        setPost(postData);
        setCategories(categoriesData);
        setAllPosts(postsData);
        
        // Initialize expanded state for the categories that the current post belongs to
        if (postData && categoriesData) {
          const initialExpandedState: Record<string, boolean> = {};
          postData.categories.forEach(catId => {
            initialExpandedState[catId] = true;
          });
          setExpandedCategories(initialExpandedState);
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
  }, [slug]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getPostsByCategory = (categoryId: string) => {
    return allPosts.filter(p => p.categories.includes(categoryId));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!post) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-8">The UPSC note you're looking for doesn't exist.</p>
          <Link
            to="/upsc-notes"
            className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
          >
            Back to UPSC Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="lg:flex lg:gap-8">
        {/* Left Sidebar - Categories Accordion (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/4">
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
                          to={`/upsc-notes/${categoryPost.slug}`}
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
              <Link
                to="/upsc-notes"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
              >
                ← Back to UPSC Notes
              </Link>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex items-center space-x-3 text-sm text-gray-500 mb-6">
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
                <span>•</span>
                <span>{post.author}</span>
              </div>

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
          
          {/* Mobile Categories Accordion (visible only on mobile) */}
          <div className="mt-8 lg:hidden">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
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
                            to={`/upsc-notes/${categoryPost.slug}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
