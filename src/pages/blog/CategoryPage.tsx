import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPublishedPosts, getCategories } from '../../services/blogService';
import { BlogPost, Category } from '../../types/blog';
import LoadingScreen from '../../components/LoadingScreen';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPublishedPosts(),
          getCategories()
        ]);
        
        // Find the category by slug
        const foundCategory = categoriesData.find(c => c.slug === categorySlug);
        setCategory(foundCategory || null);
        
        // Filter posts by category
        if (foundCategory) {
          const filteredPosts = postsData.filter(post => 
            post.categories.includes(foundCategory.id)
          );
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        // Add a small delay to show loading animation
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchData();
  }, [categorySlug]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link
            to="/upsc-notes"
            className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
          >
            Back to UPSC Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          to="/upsc-notes"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to All Categories
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name} Notes
            </h1>
            <div className="ml-4 text-blue-500 text-xl font-bold">
              {posts.length}
            </div>
          </div>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 break-inside-avoid-column hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              <Link to={`/upsc-notes/${post.slug}`} className="block mt-2">
                <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600">
                  {post.title}
                </h2>
                <p className="mt-3 text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
              <div className="mt-4">
                <Link
                  to={`/upsc-notes/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
                >
                  Read more
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage; 