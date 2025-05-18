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
    
    // First filter by current affairs if needed
    if (showCurrentAffairs) {
      result = result.filter(post => post.isCurrentAffair);
    } else {
      result = result.filter(post => !post.isCurrentAffair);
    }
    
    // Then filter by exam type if needed
    if (showCurrentAffairs && filter !== 'all') {
      result = result.filter(post => post.examType === filter);
    }
    
    setFilteredPosts(result);
  }, [posts, filter, showCurrentAffairs]);

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
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {showCurrentAffairs ? 'Current Affairs' : 'Notes'}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New {showCurrentAffairs ? 'Current Affair' : 'Note'}
          </Link>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 shadow rounded-md">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCurrentAffairs(false)}
                className={`px-3 py-1 text-sm rounded-md ${!showCurrentAffairs 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'bg-gray-100 text-gray-800'}`}
              >
                Notes
              </button>
              <button
                onClick={() => setShowCurrentAffairs(true)}
                className={`px-3 py-1 text-sm rounded-md ${showCurrentAffairs 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'bg-gray-100 text-gray-800'}`}
              >
                Current Affairs
              </button>
            </div>
          </div>
          
          {showCurrentAffairs && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md ${filter === 'all' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('upsc')}
                  className={`px-3 py-1 text-sm rounded-md ${filter === 'upsc' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  UPSC
                </button>
                <button
                  onClick={() => setFilter('tgpsc')}
                  className={`px-3 py-1 text-sm rounded-md ${filter === 'tgpsc' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  TGPSC
                </button>
                <button
                  onClick={() => setFilter('appsc')}
                  className={`px-3 py-1 text-sm rounded-md ${filter === 'appsc' 
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No {showCurrentAffairs ? 'current affairs' : 'notes'} found{showCurrentAffairs && filter !== 'all' ? ` for ${filter.toUpperCase()}` : ''}.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="sm:flex sm:items-center sm:justify-between w-full">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-lg font-medium text-blue-600 truncate">
                        {post.title}
                      </p>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                          {post.isCurrentAffair && post.examType && (
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.examType === 'upsc' ? 'bg-blue-100 text-blue-800' :
                              post.examType === 'tgpsc' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {post.examType.toUpperCase()}
                            </span>
                          )}
                          <span className="ml-2">
                            {post.isCurrentAffair && post.currentAffairDate 
                              ? `Date: ${new Date(post.currentAffairDate).toLocaleDateString()}` 
                              : `Created: ${new Date(post.createdAt).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      {post.published && (
                        <a
                          href={`/notes/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
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
