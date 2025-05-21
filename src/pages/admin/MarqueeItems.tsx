import React, { useEffect, useState } from 'react';
import { getMarqueeItems, addMarqueeItem, updateMarqueeItem, deleteMarqueeItem, MarqueeItem } from '../../services/marqueeService';
import LoadingScreen from '../../components/LoadingScreen';
import { PlusCircle, Edit2, Trash2, ArrowUp, ArrowDown, CheckCircle, XCircle } from 'lucide-react';

const MarqueeItems: React.FC = () => {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    link: '',
    active: true,
    order: 0
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getMarqueeItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching marquee items:', error);
    } finally {
      // Add a small delay to show loading animation
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const resetForm = () => {
    setFormData({
      text: '',
      link: '',
      active: true,
      order: items.length // Set order to the end of the list
    });
    setEditingItem(null);
    setFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item
        await updateMarqueeItem(editingItem.id, formData);
      } else {
        // Add new item
        await addMarqueeItem({
          ...formData,
          order: items.length // Set order to the end of the list
        });
      }
      
      // Refresh the list
      await fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error saving marquee item:', error);
    }
  };

  const handleEdit = (item: MarqueeItem) => {
    setEditingItem(item);
    setFormData({
      text: item.text,
      link: item.link || '',
      active: item.active,
      order: item.order
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteMarqueeItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting marquee item:', error);
    }
  };

  const handleMoveUp = async (item: MarqueeItem) => {
    const currentIndex = items.findIndex(i => i.id === item.id);
    if (currentIndex <= 0) return; // Already at the top
    
    const previousItem = items[currentIndex - 1];
    
    try {
      // Swap orders
      await updateMarqueeItem(item.id, { order: previousItem.order });
      await updateMarqueeItem(previousItem.id, { order: item.order });
      
      await fetchItems();
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  const handleMoveDown = async (item: MarqueeItem) => {
    const currentIndex = items.findIndex(i => i.id === item.id);
    if (currentIndex >= items.length - 1) return; // Already at the bottom
    
    const nextItem = items[currentIndex + 1];
    
    try {
      // Swap orders
      await updateMarqueeItem(item.id, { order: nextItem.order });
      await updateMarqueeItem(nextItem.id, { order: item.order });
      
      await fetchItems();
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  const handleToggleActive = async (item: MarqueeItem) => {
    try {
      await updateMarqueeItem(item.id, { active: !item.active });
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item active state:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Marquee Banner Items</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Form for adding/editing items */}
      {formOpen && (
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-medium mb-4">
            {editingItem ? 'Edit Marquee Item' : 'Add New Marquee Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Text*
              </label>
              <input
                type="text"
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Link (Optional)
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank if you don't want the text to be clickable
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                Active (visible in marquee)
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of items */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No marquee items found. Add some to display in the marquee banner.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className={`px-4 py-4 sm:px-6 ${!item.active ? 'bg-gray-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg font-medium ${item.active ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.text}
                    </p>
                    {item.link && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        Link: <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{item.link}</a>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`p-1 rounded-full ${item.active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                      title={item.active ? 'Deactivate' : 'Activate'}
                    >
                      {item.active ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleMoveUp(item)}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                      disabled={items.indexOf(item) === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(item)}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                      disabled={items.indexOf(item) === items.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 rounded-full text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded-full text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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

export default MarqueeItems;
