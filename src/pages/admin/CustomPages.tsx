import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, AlertCircle, Globe, EyeOff } from 'lucide-react';
import { getCustomPages, deleteCustomPage } from '../../services/pageService';
import { getCategories } from '../../services/blogService';
import { CustomPage } from '../../types/page';
import { Category } from '../../types/blog';
import CustomPageEditor from './CustomPageEditor';

const CustomPages: React.FC = () => {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pagesData, categoriesData] = await Promise.all([
          getCustomPages(),
          getCategories()
        ]);
        setPages(pagesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteCustomPage(id);
      setPages(pages.filter(page => page.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete page. Please try again later.');
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleEditClick = (id: string) => {
    setIsEditing(id);
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handlePageUpdated = (updatedPage: CustomPage) => {
    // Update the pages list with the updated or new page
    const existingIndex = pages.findIndex(p => p.id === updatedPage.id);
    if (existingIndex >= 0) {
      // Update existing page
      const updatedPages = [...pages];
      updatedPages[existingIndex] = updatedPage;
      setPages(updatedPages);
    } else {
      // Add new page
      setPages([updatedPage, ...pages]);
    }
    setIsEditing(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsCreating(false);
  };

  // Render the editor if creating or editing
  if (isCreating) {
    return (
      <CustomPageEditor 
        categories={categories} 
        onSave={handlePageUpdated} 
        onCancel={handleCancel} 
      />
    );
  }

  if (isEditing) {
    const pageToEdit = pages.find(page => page.id === isEditing);
    if (!pageToEdit) return <div>Page not found</div>;
    
    return (
      <CustomPageEditor 
        page={pageToEdit} 
        categories={categories} 
        onSave={handlePageUpdated} 
        onCancel={handleCancel} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map(id => categories.find(cat => cat.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Custom Pages</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Page
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No custom pages found. Create your first page!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{page.title}</div>
                    {page.description && (
                      <div className="text-sm text-gray-500">{page.description.substring(0, 50)}...</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a 
                      href={`/${page.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      /{page.slug}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCategoryNames(page.categories)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      page.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.published ? (
                        <><Globe className="w-3 h-3 mr-1" /> Published</>
                      ) : (
                        <><EyeOff className="w-3 h-3 mr-1" /> Draft</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {deleteConfirm === page.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteConfirm(page.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={handleDeleteCancel}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(page.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(page.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomPages; 