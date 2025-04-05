import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { createCustomPage, updateCustomPage, getCustomPage } from '../../services/pageService';
import { CustomPage, CustomPageFormData } from '../../types/page';
import { Category } from '../../types/blog';
import slugify from 'slugify';

interface CustomPageEditorProps {
  page?: CustomPage;
  categories: Category[];
  onSave: (page: CustomPage) => void;
  onCancel: () => void;
}

const CustomPageEditor: React.FC<CustomPageEditorProps> = ({ 
  page, 
  categories,
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [description, setDescription] = useState(page?.description || '');
  const [content, setContent] = useState(page?.content || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(page?.categories || []);
  const [published, setPublished] = useState(page?.published ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleTouched, setTitleTouched] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  // Generate slug from title if title changes and slug hasn't been manually edited
  useEffect(() => {
    if (title && !slugTouched) {
      setSlug(slugify(title, { lower: true, strict: true }));
    }
  }, [title, slugTouched]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleTouched(true);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugTouched(true);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      setError('Title is required');
      return;
    }

    if (!slug) {
      setError('Slug is required');
      return;
    }

    const formData: CustomPageFormData = {
      title,
      slug,
      description,
      content,
      categories: selectedCategories,
      published
    };

    setLoading(true);
    setError(null);

    try {
      let savedPage: CustomPage | null = null;
      
      if (page) {
        // Update existing page
        await updateCustomPage(page.id, formData);
        savedPage = await getCustomPage(page.id);
      } else {
        // Create new page
        const newPageId = await createCustomPage(formData);
        savedPage = await getCustomPage(newPageId);
      }

      if (savedPage) {
        onSave(savedPage);
      } else {
        throw new Error('Failed to save page');
      }
    } catch (err) {
      console.error('Error saving page:', err);
      setError(err instanceof Error ? err.message : 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {page ? 'Edit Page' : 'Create New Page'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Enter page title"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Page Slug
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">yourdomain.com/</span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="page-slug"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              The URL-friendly name for your page (auto-generated from title). Pages will be accessible directly at the root URL.
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Enter page description"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Page Content (HTML)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Enter HTML content for this page"
            />
            <p className="mt-1 text-sm text-gray-500">
              If no categories are selected, this content will be displayed as the page content.
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Categories (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-900">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No categories available. Create categories to organize your pages.
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              If categories are selected, the page will display posts from these categories.
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publish this page (make it visible to users)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomPageEditor; 