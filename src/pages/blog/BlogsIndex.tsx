import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedBlogPosts } from '../../services/blogService';
import { BlogPost } from '../../types/blog';
import LoadingScreen from '../../components/LoadingScreen';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogsIndex: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  
  // Pagination configuration
  const POSTS_PER_PAGE = 12;
  const totalPosts = blogs.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Calculate displayed posts for current page
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const displayedBlogs = blogs.slice(startIndex, endIndex);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
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

    const timer = setTimeout(fetchBlogs, 100);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show smart pagination
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Don't show loading screen during SSR, only on client side
  if (loading && isClient) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Insights, tips, and updates from our team to help you on your journey.
        </p>
        
        {/* Show total posts and current page info */}
        {totalPosts > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
          </div>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-600">No blog posts available yet.</h2>
          <p className="mt-4 text-gray-500">Check back soon for our latest updates and insights!</p>
        </div>
      ) : (
        <>
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedBlogs.map((blog) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex flex-wrap items-center gap-1">
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={index} className="px-3 py-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(pageNum as number)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogsIndex; 