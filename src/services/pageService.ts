import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CustomPage, CustomPageFormData } from '../types/page';
import slugify from 'slugify';

const handleFirestoreError = (error: FirestoreError, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Custom Pages
export const getCustomPages = async (): Promise<CustomPage[]> => {
  try {
    const pagesRef = collection(db, 'custom_pages');
    const q = query(pagesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomPage));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch custom pages');
    return [];
  }
};

export const getPublishedCustomPages = async (): Promise<CustomPage[]> => {
  try {
    const pagesRef = collection(db, 'custom_pages');
    const q = query(
      pagesRef,
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomPage));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch published custom pages');
    return [];
  }
};

export const getCustomPage = async (id: string): Promise<CustomPage | null> => {
  try {
    const docRef = doc(db, 'custom_pages', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as CustomPage : null;
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch custom page');
    return null;
  }
};

export const getCustomPageBySlug = async (slug: string): Promise<CustomPage | null> => {
  try {
    const pagesRef = collection(db, 'custom_pages');
    const q = query(pagesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as CustomPage;
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch custom page by slug');
    return null;
  }
};

export const createCustomPage = async (data: CustomPageFormData): Promise<string> => {
  try {
    const pagesRef = collection(db, 'custom_pages');
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    const now = Timestamp.now().toMillis();
    
    // Check if slug already exists
    const slugCheck = await getCustomPageBySlug(slug);
    if (slugCheck) {
      throw new Error('A page with this slug already exists');
    }
    
    const page = {
      ...data,
      slug,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(pagesRef, page);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error as FirestoreError, 'create custom page');
    return '';
  }
};

export const updateCustomPage = async (id: string, data: Partial<CustomPageFormData>): Promise<void> => {
  try {
    const docRef = doc(db, 'custom_pages', id);
    const updates = {
      ...data,
      updatedAt: Timestamp.now().toMillis()
    };
    
    // If title is being updated, update slug as well
    if (data.title && !data.slug) {
      updates.slug = slugify(data.title, { lower: true, strict: true });
      
      // Check if new slug already exists (excluding current page)
      const slugCheck = await getCustomPageBySlug(updates.slug);
      if (slugCheck && slugCheck.id !== id) {
        throw new Error('A page with this slug already exists');
      }
    }
    
    await updateDoc(docRef, updates);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error as FirestoreError, 'update custom page');
  }
};

export const deleteCustomPage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'custom_pages', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'delete custom page');
  }
}; 