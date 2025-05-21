import { db } from '../config/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface MarqueeItem {
  id: string;
  text: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

const COLLECTION_NAME = 'marqueeItems';

// Get all marquee items
export const getMarqueeItems = async (): Promise<MarqueeItem[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    console.log('Raw Firestore data:', querySnapshot.docs.map(doc => doc.data()));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        link: data.link || '',
        active: data.active || true,
        order: data.order || 0,
        // Safely handle timestamp conversion
        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate() 
          : new Date()
      };
    });
  } catch (error) {
    console.error('Error getting marquee items:', error);
    throw error;
  }
};

// Get active marquee items only
export const getActiveMarqueeItems = async (): Promise<MarqueeItem[]> => {
  const items = await getMarqueeItems();
  return items.filter(item => item.active);
};

// Add a new marquee item
export const addMarqueeItem = async (item: Omit<MarqueeItem, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding marquee item:', error);
    throw error;
  }
};

// Update an existing marquee item
export const updateMarqueeItem = async (id: string, item: Partial<Omit<MarqueeItem, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, item);
  } catch (error) {
    console.error('Error updating marquee item:', error);
    throw error;
  }
};

// Delete a marquee item
export const deleteMarqueeItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting marquee item:', error);
    throw error;
  }
};
