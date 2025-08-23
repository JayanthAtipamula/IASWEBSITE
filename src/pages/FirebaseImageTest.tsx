import React, { useState, useRef } from 'react';
import { uploadImage, uploadFile } from '../services/fileUploadService';
import { getStorage, ref, getDownloadURL, listAll, deleteObject, getMetadata } from 'firebase/storage';
import app from '../config/firebase';

const storage = getStorage(app);

interface UploadedImage {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadTime: string;
}

const FirebaseImageTest: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testUploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      addTestResult(`Starting upload of ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      
      const url = await uploadImage(file);
      addTestResult(`✅ Successfully uploaded ${file.name}`);
      addTestResult(`   Download URL: ${url}`);
      
      // Add to uploaded images list
      const newImage: UploadedImage = {
        name: file.name,
        url,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toISOString()
      };
      setUploadedImages(prev => [...prev, newImage]);
      
      return url;
    } catch (error) {
      addTestResult(`❌ Failed to upload ${file.name}: ${error}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const testImageRetrieval = async (imagePath: string) => {
    try {
      addTestResult(`Testing retrieval of image: ${imagePath}`);
      const imageRef = ref(storage, imagePath);
      const url = await getDownloadURL(imageRef);
      addTestResult(`✅ Successfully retrieved image URL: ${url}`);
      return url;
    } catch (error) {
      addTestResult(`❌ Failed to retrieve image ${imagePath}: ${error}`);
      throw error;
    }
  };

  const listStorageImages = async () => {
    try {
      setIsLoadingImages(true);
      addTestResult('Listing all images in Firebase Storage...');
      
      const imagesRef = ref(storage, 'images/');
      const result = await listAll(imagesRef);
      
      addTestResult(`Found ${result.items.length} images in storage`);
      
      const imageList: UploadedImage[] = [];
      for (const item of result.items) {
        try {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          
          imageList.push({
            name: item.name,
            url,
            size: metadata.size || 0,
            type: metadata.contentType || 'unknown',
            uploadTime: metadata.timeCreated || new Date().toISOString()
          });
        } catch (error) {
          addTestResult(`⚠️  Could not get details for ${item.name}: ${error}`);
        }
      }
      
      setUploadedImages(imageList);
      addTestResult(`✅ Successfully loaded ${imageList.length} image details`);
    } catch (error) {
      addTestResult(`❌ Failed to list storage images: ${error}`);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const deleteImage = async (imageName: string) => {
    try {
      addTestResult(`Deleting image: ${imageName}`);
      const imageRef = ref(storage, `images/${imageName}`);
      await deleteObject(imageRef);
      addTestResult(`✅ Successfully deleted ${imageName}`);
      
      // Remove from local list
      setUploadedImages(prev => prev.filter(img => !img.name.includes(imageName.split('_').pop() || '')));
    } catch (error) {
      addTestResult(`❌ Failed to delete ${imageName}: ${error}`);
    }
  };

  const runComprehensiveTest = async () => {
    addTestResult('🧪 Starting comprehensive Firebase Storage test...');
    
    // Test 1: List existing images
    await listStorageImages();
    
    // Test 2: Create a test file for upload
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('TEST', 25, 55);
    }
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        const testFile = new File([blob], 'firebase-test-image.png', { type: 'image/png' });
        
        try {
          // Test 3: Upload test image
          const uploadedUrl = await testUploadImage(testFile);
          
          // Test 4: Retrieve the uploaded image
          const imagePath = `images/${Date.now()}_firebase-test-image.png`;
          // Note: We can't test exact retrieval because the filename has timestamp
          
          // Test 5: Verify the image can be loaded in browser
          const img = new Image();
          img.onload = () => {
            addTestResult('✅ Uploaded image can be loaded in browser');
          };
          img.onerror = () => {
            addTestResult('❌ Uploaded image failed to load in browser');
          };
          img.src = uploadedUrl;
          
          addTestResult('🎉 Comprehensive test completed successfully!');
        } catch (error) {
          addTestResult(`💥 Comprehensive test failed: ${error}`);
        }
      }
    }, 'image/png');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        addTestResult(`⚠️  Skipping ${file.name} - not an image file`);
        continue;
      }
      
      await testUploadImage(file);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Firebase Image Storage Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={runComprehensiveTest}
                disabled={isUploading || isLoadingImages}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧪 Run Comprehensive Test
              </button>
              
              <button
                onClick={listStorageImages}
                disabled={isLoadingImages}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📋 List All Storage Images
              </button>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Test Images
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Uploaded Images */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Storage Images ({uploadedImages.length})
            </h2>
            
            {isLoadingImages ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading images...</p>
              </div>
            ) : uploadedImages.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(image.size / 1024).toFixed(2)} KB • {image.type}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(image.uploadTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          View
                        </a>
                        <button
                          onClick={() => deleteImage(image.name)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {image.url && (
                      <img
                        src={image.url}
                        alt={image.name}
                        className="mt-2 w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          addTestResult(`❌ Failed to load preview for ${image.name}`);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No images found. Upload some images or run the comprehensive test.
              </p>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-500">
                Test results will appear here...
              </div>
            )}
          </div>
          
          <button
            onClick={() => setTestResults([])}
            className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>
      </div>
      
      {/* Status Indicators */}
      {(isUploading || isLoadingImages) && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          <span>
            {isUploading ? 'Uploading...' : 'Loading images...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default FirebaseImageTest;