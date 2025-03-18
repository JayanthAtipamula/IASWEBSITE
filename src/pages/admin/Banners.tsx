import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Image, Trash2, Edit, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  Banner, 
  getBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner,
  reorderBanners
} from '../../services/bannerService';

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBanners = await getBanners();
      setBanners(fetchedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to load banners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLink('');
    setActive(true);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError('Please select an image for the banner');
      return;
    }

    try {
      setLoading(true);
      await createBanner(imageFile, { title, link, active });
      setSuccessMessage('Banner created successfully!');
      setIsCreating(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error creating banner:', error);
      setError('Failed to create banner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) return;

    try {
      setLoading(true);
      await updateBanner(
        isEditing, 
        { title, link, active }, 
        imageFile || undefined
      );
      setSuccessMessage('Banner updated successfully!');
      setIsEditing(null);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      setError('Failed to update banner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteBanner(id, imageUrl);
      setSuccessMessage('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      setError('Failed to delete banner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, newActiveState: boolean) => {
    try {
      setLoading(true);
      await updateBanner(id, { active: newActiveState });
      setSuccessMessage(`Banner ${newActiveState ? 'activated' : 'deactivated'} successfully!`);
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner active state:', error);
      setError('Failed to update banner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    const newBanners = [...banners];
    [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
    
    try {
      setLoading(true);
      await reorderBanners(newBanners.map(banner => banner.id));
      setBanners(newBanners);
      setSuccessMessage('Banner order updated successfully!');
    } catch (error) {
      console.error('Error reordering banners:', error);
      setError('Failed to reorder banners. Please try again.');
      // Revert the local state change
      fetchBanners();
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= banners.length - 1) return;
    
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    
    try {
      setLoading(true);
      await reorderBanners(newBanners.map(banner => banner.id));
      setBanners(newBanners);
      setSuccessMessage('Banner order updated successfully!');
    } catch (error) {
      console.error('Error reordering banners:', error);
      setError('Failed to reorder banners. Please try again.');
      // Revert the local state change
      fetchBanners();
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (banner: Banner) => {
    setIsEditing(banner.id);
    setTitle(banner.title);
    setLink(banner.link);
    setActive(banner.active);
    setImageFile(null);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    resetForm();
  };

  const cancelCreating = () => {
    setIsCreating(false);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Banners</h1>
        
        {!isCreating && !isEditing && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Banner
          </button>
        )}
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-green-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Create Banner Form */}
      {isCreating && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Banner</h2>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For internal reference only, will not be displayed on the banner.
                </p>
              </div>
              
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="text"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image
                </label>
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Recommended size: 1920 x 600 pixels
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active (visible on the website)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelCreating}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Banner Form */}
      {isEditing && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Banner</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For internal reference only, will not be displayed on the banner.
                </p>
              </div>
              
              <div>
                <label htmlFor="edit-link" className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="text"
                  id="edit-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image (Leave empty to keep current image)
                </label>
                <input
                  type="file"
                  id="edit-image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Recommended size: 1920 x 600 pixels
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-active" className="ml-2 block text-sm text-gray-700">
                  Active (visible on the website)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      {loading && !isCreating && !isEditing ? (
        <div className="text-center py-10">
          <div className="text-gray-500">Loading banners...</div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {banners.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No banners found. Click "Add New Banner" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title/Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.map((banner, index) => (
                    <tr key={banner.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-32 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || `Banner ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {banner.title || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={banner.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {banner.link}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            banner.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {banner.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className={`p-1 rounded-full ${
                              index === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === banners.length - 1}
                            className={`p-1 rounded-full ${
                              index === banners.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-500">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleToggleActive(banner.id, !banner.active)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title={banner.active ? 'Deactivate' : 'Activate'}
                          >
                            {banner.active ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => startEditing(banner)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id, banner.imageUrl)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Banners; 