import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getCategories } from '../../services/blogService';
import { BlogPost as BlogPostType, Category } from '../../types/blog';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;
        const [postData, categoriesData] = await Promise.all([
          getBlogPostBySlug(slug),
          getCategories()
        ]);
        setPost(postData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {post.featuredImage && (
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="p-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Back to Blog
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
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

          <div className="prose prose-blue max-w-none">
            {/* Render content as markdown or HTML based on your needs */}
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
    </div>
  );
};

export default BlogPost;
