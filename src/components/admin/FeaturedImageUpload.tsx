import React, { useState, useRef } from 'react';
import { uploadImage } from '../../services/fileUploadService';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../contexts/AuthContext';

interface FeaturedImageUploadProps {
  initialImage?: string;
  onImageUploaded: (imageUrl: string | null) => void;
}

const FeaturedImageUpload: React.FC<FeaturedImageUploadProps> = ({ 
  initialImage, 
  onImageUploaded 
}) => {
  const { user, isAdmin } = useAuth();
  const [image, setImage] = useState<string | undefined>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the display URL (proxied) for the image
  const displayImageUrl = image ? getProxiedImageUrl(image) : undefined;

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      console.log('Upload Debug Info:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userAuthenticated: !!user,
        isAdmin: isAdmin,
        userUID: user?.uid,
        userEmail: user?.email
      });
      
      // Check authentication before upload
      if (!user) {
        throw new Error('You must be logged in to upload files');
      }
      
      if (!isAdmin) {
        throw new Error('You must have admin privileges to upload files');
      }
      
      const imageUrl = await uploadImage(file);
      
      setImage(imageUrl);
      onImageUploaded(imageUrl);
      console.log('Image upload successful:', imageUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error.message || 'Failed to upload image. Please try again.';
      setError(errorMessage);
      
      // Show user-friendly alert
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleImageUpload(files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    
    handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    onImageUploaded(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Featured Image
        {user && (
          <span className="ml-2 text-xs text-green-600">
            ✓ Authenticated {isAdmin ? '(Admin)' : '(User)'}
          </span>
        )}
        {!user && (
          <span className="ml-2 text-xs text-red-600">
            ⚠ Not authenticated
          </span>
        )}
      </label>
      
      {image ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
          <img 
            src={displayImageUrl || image} 
            alt="Featured" 
            className="w-full h-64 object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Change image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
        </div>
      ) : (
        <div 
          className={`flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 border-dashed'} rounded-md transition-colors duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <svg
              className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <label
                htmlFor="featured-image-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1"
              >
                <span>Upload an image</span>
                <input
                  id="featured-image-upload"
                  name="featured-image-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1 flex items-center">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="relative bg-white bg-opacity-75 rounded-md p-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-700">Uploading image...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Upload Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedImageUpload; 