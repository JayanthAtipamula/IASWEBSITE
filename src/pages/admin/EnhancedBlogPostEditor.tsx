import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogPostFormData, Category } from '../../types/blog';
import { createBlogPost, updateBlogPost, getBlogPost, getCategories } from '../../services/blogService';
import { useAuth } from '../../contexts/AuthContext';
import FirebaseEditor from '../../components/FirebaseEditor';
import FeaturedImageUpload from '../../components/admin/FeaturedImageUpload';
import LoadingScreen from '../../components/LoadingScreen';

const EnhancedBlogPostEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [lastFirebaseSave, setLastFirebaseSave] = useState<Date | null>(null);
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
    isBlog: false,
    currentAffairDate: Date.now(),
    examType: 'upsc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching categories and blog post data...');
        
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        console.log(`✅ Categories loaded: ${categoriesData.length} items`);

        if (id) {
          console.log(`🔍 Loading blog post with ID: ${id}`);
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
              isBlog: post.isBlog || false,
              currentAffairDate: post.currentAffairDate || Date.now(),
              examType: post.examType || 'upsc'
            });
            console.log('✅ Blog post loaded successfully');
          } else {
            console.log('⚠️ Blog post not found');
          }
        } else {
          // Set default author for new posts
          setFormData(prev => ({
            ...prev,
            author: user?.email || ''
          }));
          console.log('✅ New post form initialized');
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setFirebaseError(`Failed to load data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

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
    
    if (formData.isCurrentAffair && !formData.examType) {
      return { isValid: false, error: 'Exam type is required for current affairs' };
    }
    
    if (!formData.isCurrentAffair && !formData.isBlog && formData.categories.length === 0) {
      return { isValid: false, error: 'At least one category is required for regular posts' };
    }
    
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting form submission...');
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    setSaving(true);
    console.log("📋 Form data being submitted:", {
      ...formData,
      contentLength: formData.content.length
    });

    // Create submission data
    let submissionData: any = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      metaDescription: formData.metaDescription,
      categories: formData.categories,
      tags: formData.tags,
      author: formData.author,
      published: formData.published
    };

    // Add featuredImage only if it exists
    if (formData.featuredImage) {
      submissionData.featuredImage = formData.featuredImage;
    }

    // Handle current affairs specific fields
    if (formData.isCurrentAffair) {
      submissionData.isCurrentAffair = true;
      
      if (formData.currentAffairDate) {
        submissionData.currentAffairDate = typeof formData.currentAffairDate === 'string' 
          ? new Date(formData.currentAffairDate).getTime()
          : formData.currentAffairDate;
      } else {
        submissionData.currentAffairDate = Date.now();
      }
      
      submissionData.examType = formData.examType || 'upsc';
    } else {
      submissionData.isCurrentAffair = false;
    }

    // Handle blog specific fields
    submissionData.isBlog = formData.isBlog;

    try {
      if (id) {
        console.log(`📝 Updating existing post with ID: ${id}`);
        await updateBlogPost(id, submissionData);
        console.log('✅ Post updated successfully');
      } else {
        console.log('📝 Creating new post');
        const newId = await createBlogPost(submissionData);
        console.log(`✅ New post created with ID: ${newId}`);
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('❌ Error saving post:', error);
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

  // Firebase editor handlers
  const handleFirebaseContentChange = (content: string) => {
    console.log(`📝 Firebase content updated: ${content.length} characters`);
    setFormData(prev => ({ ...prev, content }));
  };

  const handleFirebaseTitleChange = (title: string) => {
    console.log(`📝 Firebase title updated: "${title}"`);
    setFormData(prev => ({ ...prev, title }));
  };

  const handleFirebaseError = (error: Error) => {
    console.error('❌ Firebase Editor Error:', error);
    setFirebaseError(error.message);
  };

  const handleFirebaseSaved = (data: any) => {
    console.log('✅ Content auto-saved to Firebase:', data.id);
    setLastFirebaseSave(new Date());
    setFirebaseError(null);
  };

  const handleFirebaseLoaded = (data: any) => {
    console.log('✅ Content loaded from Firebase:', data.id);
    // Note: We don't update formData here to avoid conflicts with the main form
    setFirebaseError(null);
  };

  const handleFeaturedImageChange = (imageUrl: string | null) => {
    if (imageUrl === null) {
      setFormData(prev => {
        const newData = { ...prev };
        delete newData.featuredImage;
        return newData;
      });
    } else if (imageUrl && imageUrl.trim() !== '') {
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
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Edit Post' : 'Create New Post'}
          {id && (
            <span className="ml-2 text-sm text-gray-500">
              (ID: {id})
            </span>
          )}
        </h1>
        {lastFirebaseSave && (
          <div className="text-sm text-green-600">
            Auto-saved: {lastFirebaseSave.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Firebase Error Display */}
      {firebaseError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Firebase Editor Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{firebaseError}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setFirebaseError(null)}
                  className="bg-red-100 px-2 py-1 rounded text-sm text-red-800 hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            
            {/* Featured Image Upload */}
            <FeaturedImageUpload 
              initialImage={formData.featuredImage} 
              onImageUploaded={handleFeaturedImageChange} 
            />

            {/* Firebase-Enabled Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title and Content
                <span className="text-xs text-gray-500 ml-2">
                  (Auto-saved to Firebase every 5 seconds)
                </span>
              </label>
              <FirebaseEditor
                collection="blog-drafts"
                documentId={id || `draft-${Date.now()}`}
                autoSave={true}
                autoSaveInterval={5000}
                enableRealtimeSync={false}
                showTitle={true}
                showStatus={true}
                placeholder="Write your post content here..."
                onContentChange={handleFirebaseContentChange}
                onTitleChange={handleFirebaseTitleChange}
                onError={handleFirebaseError}
                onSaved={handleFirebaseSaved}
                onLoaded={handleFirebaseLoaded}
              />
            </div>

            {/* Excerpt */}
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

            {/* Meta Description */}
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

            {/* Checkboxes for post types */}
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isBlog"
                  id="isBlog"
                  checked={formData.isBlog}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isBlog" className="block text-sm font-medium text-gray-700">
                  This is a Blog Post
                </label>
              </div>

              {/* Current Affairs specific fields */}
              {formData.isCurrentAffair && (
                <>
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
                  <div className="mt-4">
                    <label htmlFor="examType" className="block text-sm font-medium text-gray-700">
                      Exam Type
                    </label>
                    <select
                      name="examType"
                      id="examType"
                      required={formData.isCurrentAffair}
                      value={formData.examType || 'upsc'}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="upsc">UPSC</option>
                      <option value="tgpsc">TGPSC</option>
                      <option value="appsc">APPSC</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Categories (hidden for current affairs and blogs) */}
            <div className={formData.isCurrentAffair || formData.isBlog ? 'hidden' : ''}>
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

            {/* Tags */}
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

            {/* Publish checkbox */}
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

        {/* Action Buttons */}
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
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedBlogPostEditor;