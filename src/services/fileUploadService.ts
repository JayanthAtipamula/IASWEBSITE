import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import app from '../config/firebase';

// Initialize Firebase Storage
const storage = getStorage(app);
const auth = getAuth(app);

/**
 * Validates file before upload
 * @param file The file to validate
 * @returns boolean indicating if file is valid
 */
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check file type for images
  if (file.type && file.type.startsWith('image/')) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP' };
    }
  }

  return { isValid: true };
};

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage where the file should be saved
 * @returns Promise with the download URL
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Check authentication
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to upload files');
    }

    console.log('Upload attempt:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      path: path,
      userId: currentUser.uid
    });

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Create a storage reference
    const storageRef = ref(storage, path);
    console.log('Storage reference created:', storageRef.fullPath);

    // Set metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'uploaded-by': currentUser.uid,
        'upload-timestamp': new Date().toISOString()
      }
    };

    // Upload the file
    console.log('Starting upload...');
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('Upload completed:', snapshot.metadata);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);

    return downloadURL;
  } catch (error: any) {
    console.error('Detailed upload error:', {
      error: error,
      errorCode: error.code,
      errorMessage: error.message,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      path: path,
      userAuthenticated: !!auth.currentUser
    });
    
    // Provide more specific error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('Upload failed: Insufficient permissions. Please check if you are logged in.');
    } else if (error.code === 'storage/quota-exceeded') {
      throw new Error('Upload failed: Storage quota exceeded.');
    } else if (error.code === 'storage/invalid-checksum') {
      throw new Error('Upload failed: File corrupted during upload. Please try again.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload canceled.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Upload failed: Server error (412). This might be due to storage rules or authentication. Please try again or contact support.');
    } else {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
};

/**
 * Uploads an image to Firebase Storage with a unique name
 * @param file The image file to upload
 * @returns Promise with the download URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Generate a unique filename with sanitized original name
  const timestamp = new Date().getTime();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}_${sanitizedFileName}`;
  
  // Upload to the images folder
  return uploadFile(file, `images/${fileName}`);
}; 