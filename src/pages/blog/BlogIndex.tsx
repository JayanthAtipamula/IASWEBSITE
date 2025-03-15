import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedPosts, getCategories } from '../../services/blogService';
import { BlogPost, Category } from '../../types/blog';

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPublishedPosts(),
          getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categories.includes(selectedCategory))
    : posts;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-9">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="block mt-2">
                    <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </Link>
                  <div className="mt-4">
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
                  <div className="mt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  selectedCategory === ''
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
