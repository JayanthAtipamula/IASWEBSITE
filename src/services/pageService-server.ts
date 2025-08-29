import { adminDb } from '../config/firebase-admin';
import { CustomPage } from '../types/page';

// Server-side page service for SSR
export const getCustomPageBySlugServer = async (slug: string): Promise<CustomPage | null> => {
  try {
    console.log('Server: Starting to fetch custom page with slug:', slug);
    
    const pagesRef = adminDb.collection('custom_pages');
    console.log('Server: Collection reference created');
    
    const q = pagesRef.where('slug', '==', slug).where('published', '==', true);
    console.log('Server: Query created with slug:', slug, 'and published: true');
    
    const snapshot = await q.get();
    console.log('Server: Query executed, snapshot size:', snapshot.size);
    
    if (snapshot.empty) {
      console.log('Server: No pages found with slug:', slug);
      return null;
    }
    
    const doc = snapshot.docs[0];
    const pageData = { id: doc.id, ...doc.data() } as CustomPage;
    console.log('Server: Page found with ID:', doc.id);
    console.log('Server: Page title:', pageData.title);
    
    return pageData;
  } catch (error) {
    console.error('Server: Error fetching custom page:', error);
    return null;
  }
};

export const getPublishedCustomPagesServer = async (): Promise<CustomPage[]> => {
  try {
    const pagesRef = adminDb.collection('custom_pages');
    const q = pagesRef.where('published', '==', true).orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomPage));
  } catch (error) {
    console.error('Server-side error fetching published custom pages:', error);
    return [];
  }
};

export const getCustomPageByIdServer = async (id: string): Promise<CustomPage | null> => {
  try {
    const docRef = adminDb.collection('custom_pages').doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as CustomPage;
    }
    return null;
  } catch (error) {
    console.error('Server-side error fetching custom page by ID:', error);
    return null;
  }
};
