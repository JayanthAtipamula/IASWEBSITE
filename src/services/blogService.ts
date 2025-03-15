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
import { BlogPost, BlogPostFormData, Category } from '../types/blog';
import slugify from 'slugify';

const handleFirestoreError = (error: FirestoreError, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Blog Posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch blog posts');
    return [];
  }
};

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch published posts');
    return [];
  }
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as BlogPost : null;
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch blog post');
    return null;
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch blog post by slug');
    return null;
  }
};

export const createBlogPost = async (data: BlogPostFormData): Promise<string> => {
  try {
    const postsRef = collection(db, 'posts');
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    const now = Timestamp.now().toMillis();
    
    // Check if slug already exists
    const slugCheck = await getBlogPostBySlug(slug);
    if (slugCheck) {
      throw new Error('A post with this slug already exists');
    }
    
    const post = {
      ...data,
      slug,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(postsRef, post);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error as FirestoreError, 'create blog post');
    return '';
  }
};

export const updateBlogPost = async (id: string, data: Partial<BlogPostFormData>): Promise<void> => {
  try {
    const docRef = doc(db, 'posts', id);
    const updates = {
      ...data,
      updatedAt: Timestamp.now().toMillis()
    };
    
    // If title is being updated, update slug as well
    if (data.title && !data.slug) {
      updates.slug = slugify(data.title, { lower: true, strict: true });
      
      // Check if new slug already exists (excluding current post)
      const slugCheck = await getBlogPostBySlug(updates.slug);
      if (slugCheck && slugCheck.id !== id) {
        throw new Error('A post with this slug already exists');
      }
    }
    
    await updateDoc(docRef, updates);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error as FirestoreError, 'update blog post');
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'delete blog post');
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch categories');
    return [];
  }
};

export const createCategory = async (name: string): Promise<string> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if category with this slug already exists
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error('A category with this name already exists');
    }
    
    const docRef = await addDoc(categoriesRef, { name, slug });
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error as FirestoreError, 'create category');
    return '';
  }
};

export const updateCategory = async (id: string, name: string): Promise<void> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if category with this slug already exists (excluding current category)
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty && snapshot.docs[0].id !== id) {
      throw new Error('A category with this name already exists');
    }
    
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, { name, slug });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handleFirestoreError(error as FirestoreError, 'update category');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'delete category');
  }
};
