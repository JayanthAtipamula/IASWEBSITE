import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

const COLLECTION_NAME = 'banners';

// Interface for banner data
export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  title?: string;
  order: number;
  active: boolean;
  createdAt: number;
}

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Banner));
  } catch (error) {
    console.error('Error getting banners:', error);
    throw error;
  }
};

// Get active banners (for frontend display)
export const getActiveBanners = async (): Promise<Banner[]> => {
  try {
    const banners = await getBanners();
    return banners.filter(banner => banner.active);
  } catch (error) {
    console.error('Error getting active banners:', error);
    throw error;
  }
};

// Upload banner image to Firebase Storage
export const uploadBannerImage = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

// Create a new banner
export const createBanner = async (
  file: File, 
  data: { title?: string; link: string; active: boolean }
): Promise<string> => {
  try {
    // Get the count of existing banners to determine order
    const banners = await getBanners();
    const order = banners.length;
    
    // Upload the image
    const imageUrl = await uploadBannerImage(file);
    
    // Add the banner to Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      imageUrl,
      title: data.title || '',
      link: data.link,
      order,
      active: data.active,
      createdAt: Date.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

// Update a banner
export const updateBanner = async (
  id: string, 
  data: { title?: string; link?: string; order?: number; active?: boolean },
  file?: File
): Promise<void> => {
  try {
    const bannerRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, any> = { ...data };
    
    // If a new file is provided, upload it and update the imageUrl
    if (file) {
      const imageUrl = await uploadBannerImage(file);
      updateData.imageUrl = imageUrl;
    }
    
    await updateDoc(bannerRef, updateData);
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

// Delete a banner and its image from storage
export const deleteBanner = async (id: string, imageUrl: string): Promise<void> => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    
    // Extract the path from the URL and delete from Storage
    try {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch (storageError) {
      console.error('Error deleting banner image from storage:', storageError);
      // Continue even if storage deletion fails
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// Reorder banners
export const reorderBanners = async (orderedIds: string[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    orderedIds.forEach((id, index) => {
      const bannerRef = doc(db, COLLECTION_NAME, id);
      batch.update(bannerRef, { order: index });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering banners:', error);
    throw error;
  }
}; 