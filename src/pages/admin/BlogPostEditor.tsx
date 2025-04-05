import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogPostFormData, Category } from '../../types/blog';
import { createBlogPost, updateBlogPost, getBlogPost, getCategories } from '../../services/blogService';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FeaturedImageUpload from '../../components/admin/FeaturedImageUpload';
import LoadingScreen from '../../components/LoadingScreen';

const BlogPostEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    excerpt: '',
    metaDescription: '',
    categories: [],
    tags: [],
    author: '',
    published: false,
    isCurrentAffair: false,
    currentAffairDate: Date.now()
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (id) {
          const post = await getBlogPost(id);
          if (post) {
            setFormData({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              metaDescription: post.metaDescription || '',
              featuredImage: post.featuredImage,
              categories: post.categories,
              tags: post.tags || [],
              author: post.author,
              published: post.published,
              isCurrentAffair: post.isCurrentAffair || false,
              currentAffairDate: post.currentAffairDate || Date.now()
            });
          }
        } else {
          // Set default author for new posts
          setFormData(prev => ({
            ...prev,
            author: user?.email || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // Add this validation function
  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.title.trim()) {
      return { isValid: false, error: 'Title is required' };
    }
    
    if (!formData.content.trim()) {
      return { isValid: false, error: 'Content is required' };
    }
    
    if (!formData.excerpt.trim()) {
      return { isValid: false, error: 'Excerpt is required' };
    }
    
    if (formData.isCurrentAffair && !formData.currentAffairDate) {
      return { isValid: false, error: 'Current affair date is required' };
    }
    
    if (!formData.isCurrentAffair && formData.categories.length === 0) {
      return { isValid: false, error: 'At least one category is required' };
    }
    
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    setSaving(true);
    console.log("Submitting form data:", formData);

    try {
      if (id) {
        console.log("Updating existing post with ID:", id);
        await updateBlogPost(id, formData);
        console.log("Post updated successfully");
      } else {
        console.log("Creating new post");
        const newId = await createBlogPost(formData);
        console.log("New post created with ID:", newId);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      // Show error message to user (you could add state for this)
      alert(`Failed to save post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleFeaturedImageChange = (imageUrl: string | null) => {
    if (imageUrl === null) {
      // If null is passed, remove the featuredImage property
      setFormData(prev => {
        const newData = { ...prev };
        delete newData.featuredImage;
        return newData;
      });
    } else if (imageUrl && imageUrl.trim() !== '') {
      // Only update if we have a valid string
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, categories: selectedOptions }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value).getTime();
    setFormData(prev => ({ ...prev, currentAffairDate: date }));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <FeaturedImageUpload 
              initialImage={formData.featuredImage} 
              onImageUploaded={handleFeaturedImageChange} 
            />

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <RichTextEditor 
                content={formData.content} 
                onChange={handleContentChange} 
                placeholder="Write your post content here..."
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                required
                value={formData.excerpt}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                Meta Description (for SEO)
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                rows={2}
                value={formData.metaDescription || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description for search engines (150-160 characters recommended)"
                maxLength={160}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.metaDescription ? formData.metaDescription.length : 0}/160 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isCurrentAffair"
                  id="isCurrentAffair"
                  checked={formData.isCurrentAffair}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isCurrentAffair" className="block text-sm font-medium text-gray-700">
                  This is a Current Affair
                </label>
              </div>

              {formData.isCurrentAffair && (
                <div>
                  <label htmlFor="currentAffairDate" className="block text-sm font-medium text-gray-700">
                    Current Affair Date
                  </label>
                  <input
                    type="date"
                    name="currentAffairDate"
                    id="currentAffairDate"
                    required={formData.isCurrentAffair}
                    value={formData.currentAffairDate ? new Date(formData.currentAffairDate).toISOString().substring(0, 10) : ''}
                    onChange={handleDateChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
            </div>

            <div className={formData.isCurrentAffair ? 'hidden' : ''}>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              <select
                id="categories"
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleCategoryChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl (or Cmd) to select multiple categories
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags?.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publish post
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostEditor;
