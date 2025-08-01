import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, deleteBlogPost } from '../../services/blogService';
import { BlogPost } from '../../types/blog';
import LoadingScreen from '../../components/LoadingScreen';

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showCurrentAffairs, setShowCurrentAffairs] = useState<boolean>(false);
  const [showBlogs, setShowBlogs] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const data = await getBlogPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      // Add a small delay to show loading animation
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on selected filter
  useEffect(() => {
    let result = [...posts];
    
    // Filter by content type
    if (showCurrentAffairs) {
      result = result.filter(post => post.isCurrentAffair);
      // Then filter by exam type if needed
      if (filter !== 'all') {
        result = result.filter(post => post.examType === filter);
      }
    } else if (showBlogs) {
      result = result.filter(post => post.isBlog);
    } else {
      // Show regular notes (neither current affairs nor blogs)
      result = result.filter(post => !post.isCurrentAffair && !post.isBlog);
    }
    
    setFilteredPosts(result);
  }, [posts, filter, showCurrentAffairs, showBlogs]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deleteBlogPost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {showCurrentAffairs ? 'Current Affairs' : showBlogs ? 'Blog Posts' : 'Notes'}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New {showCurrentAffairs ? 'Current Affair' : showBlogs ? 'Blog Post' : 'Note'}
          </Link>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 shadow rounded-md">
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowCurrentAffairs(false);
                  setShowBlogs(false);
                }}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${!showCurrentAffairs && !showBlogs
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'bg-gray-100 text-gray-800'}`}
              >
                Notes
              </button>
              <button
                onClick={() => {
                  setShowCurrentAffairs(false);
                  setShowBlogs(true);
                }}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${showBlogs
                  ? 'bg-green-100 text-green-800 font-medium' 
                  : 'bg-gray-100 text-gray-800'}`}
              >
                Blogs
              </button>
              <button
                onClick={() => {
                  setShowCurrentAffairs(true);
                  setShowBlogs(false);
                }}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${showCurrentAffairs
                  ? 'bg-orange-100 text-orange-800 font-medium' 
                  : 'bg-gray-100 text-gray-800'}`}
              >
                Current Affairs
              </button>
            </div>
          </div>
          
          {showCurrentAffairs && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === 'all' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('upsc')}
                  className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === 'upsc' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  UPSC
                </button>
                <button
                  onClick={() => setFilter('tgpsc')}
                  className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === 'tgpsc' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  TGPSC
                </button>
                <button
                  onClick={() => setFilter('appsc')}
                  className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${filter === 'appsc' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  APPSC
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-full">
        {filteredPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No {showCurrentAffairs ? 'current affairs' : showBlogs ? 'blog posts' : 'notes'} found{showCurrentAffairs && filter !== 'all' ? ` for ${filter.toUpperCase()}` : ''}.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6 max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-full">
                  <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                    <p className="text-lg font-medium text-blue-600 truncate break-all">
                      {post.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.isCurrentAffair && post.examType && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.examType === 'upsc' ? 'bg-blue-100 text-blue-800' :
                          post.examType === 'tgpsc' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {post.examType.toUpperCase()}
                        </span>
                      )}
                      {post.isBlog && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          BLOG
                        </span>
                      )}
                      <span className="text-xs whitespace-nowrap">
                        {post.isCurrentAffair && post.currentAffairDate 
                          ? `Date: ${new Date(post.currentAffairDate).toLocaleDateString()}` 
                          : `Created: ${new Date(post.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 break-words line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1 flex-shrink-0">
                    <Link
                      to={`/admin/posts/edit/${post.id}`}
                      className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 hover:border-red-300 transition-colors"
                    >
                      Delete
                    </button>
                    {post.published && (
                      <a
                        href={post.isBlog ? `/blogs/${post.slug}` : `/notes/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
};

export default BlogPosts;
