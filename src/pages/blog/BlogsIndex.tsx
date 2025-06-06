import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedBlogPosts } from '../../services/blogService';
import { BlogPost } from '../../types/blog';
import LoadingScreen from '../../components/LoadingScreen';

const BlogsIndex: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Use the optimized blog posts function
        const blogPosts = await getPublishedBlogPosts();
        setBlogs(blogPosts);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Insights, tips, and updates from our team to help you on your journey.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-600">No blog posts available yet.</h2>
          <p className="mt-4 text-gray-500">Check back soon for our latest updates and insights!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {blog.featuredImage && (
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                  <time dateTime={new Date(blog.createdAt).toISOString()}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{blog.author}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                  <Link to={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {blog.excerpt}
                </p>
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-auto">
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                  >
                    Read More
                    <svg 
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsIndex; 