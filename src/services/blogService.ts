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

export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('published', '==', true),
      where('isBlog', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    // If the query fails (e.g., due to missing index), fall back to client-side filtering
    console.warn('Direct blog query failed, falling back to client-side filtering:', error);
    const allPosts = await getPublishedPosts();
    return allPosts.filter(post => post.isBlog === true);
  }
};

export const getCurrentAffairsPosts = async (): Promise<BlogPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    
    try {
      // First try with the full query with ordering
      const q = query(
        postsRef,
        where('published', '==', true),
        where('isCurrentAffair', '==', true),
        orderBy('currentAffairDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      
      // If we got posts, return them
      if (posts.length > 0) {
        return posts;
      }
      
      // If no posts found via index, try simpler query without ordering
      const qSimple = query(
        postsRef,
        where('published', '==', true),
        where('isCurrentAffair', '==', true)
      );
      const snapshotSimple = await getDocs(qSimple);
      const postsSimple = snapshotSimple.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      
      if (postsSimple.length > 0) {
        // Sort manually if we got posts
        return postsSimple.sort((a, b) => {
          const dateA = a.currentAffairDate || 0;
          const dateB = b.currentAffairDate || 0;
          return dateB - dateA;
        });
      }
    } catch (indexError) {
      console.error('Error with indexed query:', indexError);
      // Fall through to sample data
    }
    
    // If still no posts, return sample data
    console.log('No current affairs found, returning sample data');
    return getSampleCurrentAffairs();
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    return getSampleCurrentAffairs();
  }
};

// Sample current affairs for development and testing
const getSampleCurrentAffairs = (): BlogPost[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000; // One day in milliseconds
  
  return [
    {
      id: 'sample-ca-1',
      title: 'Union Budget 2024-25 Highlights',
      slug: 'union-budget-2024-25-highlights',
      content: '<p>Finance Minister presented the Union Budget 2024-25 in Parliament today. Key highlights include...</p>',
      excerpt: 'Key highlights from the Union Budget 2024-25 focusing on economic growth, tax reforms, and infrastructure development.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - (day * 1),
      createdAt: now - (day * 1),
      updatedAt: now - (day * 1)
    },
    {
      id: 'sample-ca-2',
      title: 'Supreme Court Judgment on Electoral Bonds',
      slug: 'supreme-court-judgment-electoral-bonds',
      content: '<p>The Supreme Court today delivered its verdict on the electoral bonds scheme...</p>',
      excerpt: 'Analysis of the Supreme Court\'s landmark judgment on the electoral bonds scheme and its implications.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - (day * 3),
      createdAt: now - (day * 3),
      updatedAt: now - (day * 3)
    },
    {
      id: 'sample-ca-3',
      title: 'G20 Summit 2024: Key Outcomes',
      slug: 'g20-summit-2024-key-outcomes',
      content: '<p>The G20 Summit concluded with several important decisions and agreements...</p>',
      excerpt: 'Summary of the key outcomes from the G20 Summit 2024 and their global implications.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - (day * 5),
      createdAt: now - (day * 5),
      updatedAt: now - (day * 5)
    },
    {
      id: 'sample-ca-4',
      title: 'New National Education Policy Implementation Update',
      slug: 'new-national-education-policy-implementation-update',
      content: '<p>The Ministry of Education released an update on the implementation of the National Education Policy...</p>',
      excerpt: 'Latest updates on the implementation status of the National Education Policy across various states.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - (day * 7),
      createdAt: now - (day * 7),
      updatedAt: now - (day * 7)
    },
    {
      id: 'sample-ca-5',
      title: 'Important Cabinet Decisions This Week',
      slug: 'important-cabinet-decisions-this-week',
      content: '<p>The Union Cabinet approved several key decisions this week including...</p>',
      excerpt: 'Summary of important decisions taken by the Union Cabinet this week affecting various sectors.',
      categories: [],
      author: 'Admin',
      published: true,
      isCurrentAffair: true,
      currentAffairDate: now - (day * 10),
      createdAt: now - (day * 10),
      updatedAt: now - (day * 10)
    }
  ];
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
    
    // Create clean post object without undefined values
    const post: Record<string, any> = {
      slug,
      createdAt: now,
      updatedAt: now
    };
    
    // Copy only defined values from data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        post[key] = value;
      }
    });
    
    console.log('Creating post with data:', post);
    
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
    console.log(`Attempting to update blog post with ID: ${id}`, data);
    
    if (!id) {
      throw new Error('Post ID is required for updating');
    }
    
    const docRef = doc(db, 'posts', id);
    
    // First check if the document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Post with ID ${id} does not exist`);
    }
    
    // Create updates object with timestamp
    const updates: Record<string, any> = {
      updatedAt: Timestamp.now().toMillis()
    };
    
    // Copy only defined fields from data to updates
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        updates[key] = value;
      }
    });
    
    // If title is being updated, update slug as well
    if (data.title && !data.slug) {
      updates.slug = slugify(data.title, { lower: true, strict: true });
      
      // Check if new slug already exists (excluding current post)
      const slugCheck = await getBlogPostBySlug(updates.slug);
      if (slugCheck && slugCheck.id !== id) {
        throw new Error('A post with this slug already exists');
      }
    }
    
    console.log(`Updating document with data:`, updates);
    await updateDoc(docRef, updates);
    console.log(`Document successfully updated`);
  } catch (error) {
    console.error('Error updating blog post:', error);
    if (error instanceof FirestoreError) {
      console.error(`Firestore error code: ${error.code}, message: ${error.message}`);
      handleFirestoreError(error, 'update blog post');
    } else if (error instanceof Error) {
      // Re-throw application errors
      throw error;
    } else {
      // Handle unknown errors
      throw new Error(`Unknown error updating blog post: ${error}`);
    }
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

