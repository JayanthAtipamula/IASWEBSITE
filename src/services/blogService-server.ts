import { adminDb } from '../config/firebase-admin';
import { BlogPost, Category } from '../types/blog';

// Server-side blog service for SSR
export const getBlogPostBySlugServer = async (slug: string): Promise<BlogPost | null> => {
  try {
    console.log('Server: Starting to fetch blog post with slug:', slug);
    
    const postsRef = adminDb.collection('posts');
    console.log('Server: Collection reference created');
    
    const q = postsRef.where('slug', '==', slug).where('published', '==', true);
    console.log('Server: Query created with slug:', slug, 'and published: true');
    
    const snapshot = await q.get();
    console.log('Server: Query executed, snapshot size:', snapshot.size);
    console.log('Server: Snapshot empty:', snapshot.empty);
    
    if (snapshot.empty) {
      console.log('Server: No posts found with slug:', slug);
      return null;
    }
    
    const doc = snapshot.docs[0];
    const postData = { id: doc.id, ...doc.data() } as BlogPost;
    console.log('Server: Post found with ID:', doc.id);
    console.log('Server: Post title:', postData.title);
    console.log('Server: Post published status:', postData.published);
    
    return postData;
  } catch (error) {
    console.error('Server: Error fetching blog post:', error);
    console.error('Server: Error details:', error.message);
    if (error.code) {
      console.error('Server: Firebase error code:', error.code);
    }
    return null;
  }
};

export const getCategoriesServer = async (): Promise<Category[]> => {
  try {
    const categoriesRef = adminDb.collection('categories');
    const snapshot = await categoriesRef.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (error) {
    console.error('Server-side error fetching categories:', error);
    return [];
  }
};

export const getPublishedPostsServer = async (): Promise<BlogPost[]> => {
  try {
    const postsRef = adminDb.collection('posts');
    const q = postsRef.where('published', '==', true).orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error('Server-side error fetching published posts:', error);
    return [];
  }
};

export const getCurrentAffairsPostsServer = async (): Promise<BlogPost[]> => {
  try {
    const postsRef = adminDb.collection('posts');
    const q = postsRef.where('published', '==', true).where('isCurrentAffair', '==', true);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error('Server-side error fetching current affairs:', error);
    return [];
  }
};
