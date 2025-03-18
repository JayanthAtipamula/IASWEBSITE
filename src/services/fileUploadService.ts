import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../config/firebase';

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage where the file should be saved
 * @returns Promise with the download URL
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Uploads an image to Firebase Storage with a unique name
 * @param file The image file to upload
 * @returns Promise with the download URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Generate a unique filename
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}_${file.name}`;
  
  // Upload to the images folder
  return uploadFile(file, `images/${fileName}`);
}; 