import { adminDb } from '../config/firebase-admin';
import { BlogPost } from '../types/blog';

// Server-side current affairs service for SSR
export const getCurrentAffairsByDateServer = async (dateParam: string, examType: string): Promise<BlogPost[]> => {
  try {
    console.log('Server: Fetching current affairs for date:', dateParam, 'exam type:', examType);
    
    const postsRef = adminDb.collection('posts');
    const q = postsRef
      .where('published', '==', true)
      .where('isCurrentAffair', '==', true)
      .where('examType', '==', examType)
      .where('dateParam', '==', dateParam)
      .orderBy('createdAt', 'desc');
    
    const snapshot = await q.get();
    console.log(`Server: Found ${snapshot.docs.length} current affairs posts`);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error('Server-side error fetching current affairs by date:', error);
    return [];
  }
};

export const getCurrentAffairsBySlugServer = async (dateParam: string, slug: string, examType: string): Promise<BlogPost | null> => {
  try {
    console.log('Server: Fetching current affairs post with slug:', slug, 'date:', dateParam, 'exam type:', examType);
    
    const postsRef = adminDb.collection('posts');
    const q = postsRef
      .where('published', '==', true)
      .where('isCurrentAffair', '==', true)
      .where('examType', '==', examType)
      .where('dateParam', '==', dateParam)
      .where('slug', '==', slug);
    
    const snapshot = await q.get();
    
    if (snapshot.empty) {
      console.log('Server: No current affairs post found');
      return null;
    }
    
    const doc = snapshot.docs[0];
    const postData = { id: doc.id, ...doc.data() } as BlogPost;
    console.log('Server: Current affairs post found with ID:', doc.id);
    
    return postData;
  } catch (error) {
    console.error('Server-side error fetching current affairs post:', error);
    return null;
  }
};

export const getCurrentAffairsDatesServer = async (examType: string): Promise<string[]> => {
  try {
    console.log('Server: Fetching current affairs dates for exam type:', examType);
    
    const postsRef = adminDb.collection('posts');
    const q = postsRef
      .where('published', '==', true)
      .where('isCurrentAffair', '==', true)
      .where('examType', '==', examType);
    
    const snapshot = await q.get();
    const dates = [...new Set(snapshot.docs.map(doc => doc.data().dateParam))];
    
    console.log(`Server: Found ${dates.length} unique dates`);
    return dates.sort().reverse(); // Most recent first
  } catch (error) {
    console.error('Server-side error fetching current affairs dates:', error);
    return [];
  }
};
