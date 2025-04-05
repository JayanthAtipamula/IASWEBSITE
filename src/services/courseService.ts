import { 
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreError,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Course } from '../types/course';

const handleFirestoreError = (error: FirestoreError | Error, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  if (error instanceof FirestoreError) {
    console.error(`Firestore error code: ${error.code}`);
  }
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    console.log('Fetching courses from Firestore...');
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    console.log(`Fetched ${snapshot.docs.length} courses`);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch courses');
    return [];
  }
};

// Get course by ID
export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const courseRef = doc(db, 'courses', id);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() } as Course;
    } else {
      console.log('No such course!');
      return null;
    }
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'fetch course');
    return null;
  }
};

// Create a new course
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
  try {
    console.log('Creating new course with data:', courseData);
    const now = Date.now();
    const data = {
      ...courseData,
      createdAt: now,
      updatedAt: now,
    };
    
    const coursesRef = collection(db, 'courses');
    const docRef = await addDoc(coursesRef, data);
    console.log('Course created with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...data
    } as Course;
  } catch (error) {
    console.error('Error creating course:', error);
    handleFirestoreError(error as Error, 'create course');
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (id: string, courseData: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const courseRef = doc(db, 'courses', id);
    const updates = {
      ...courseData,
      updatedAt: Date.now()
    };
    
    await updateDoc(courseRef, updates);
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'update course');
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const courseRef = doc(db, 'courses', id);
    await deleteDoc(courseRef);
  } catch (error) {
    handleFirestoreError(error as FirestoreError, 'delete course');
    throw error;
  }
};

// Sample courses data for development/demo purposes
export const getSampleCourses = (): Course[] => {
  const now = Date.now();
  return [
    {
      id: '1',
      title: 'Complete UPSC CSE Prelims Course',
      description: 'Comprehensive preparation for UPSC Civil Services Examination Prelims with detailed coverage of all subjects.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 9999,
      duration: '6 months',
      features: [
        'Complete subject coverage',
        '1000+ practice questions',
        'Mock tests with analysis',
        'Personalized mentoring'
      ],
      paymentLink: 'https://example.com/pay/upsc-prelims-course',
      createdAt: now,
      updatedAt: now
    },
    {
      id: '2',
      title: 'UPSC CSE Mains Optional: History',
      description: 'In-depth coverage of History optional for UPSC CSE Mains examination with expert guidance.',
      imageUrl: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 7999,
      duration: '4 months',
      features: [
        'Comprehensive study material',
        'Answer writing practice',
        'Previous years papers analysis',
        'Weekly tests'
      ],
      paymentLink: 'https://example.com/pay/history-optional',
      createdAt: now - 86400000,
      updatedAt: now - 86400000
    },
    {
      id: '3',
      title: 'Current Affairs Mastery Program',
      description: 'Stay updated with the most relevant current affairs for UPSC and other competitive examinations.',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 3999,
      duration: '3 months',
      features: [
        'Daily current affairs updates',
        'Monthly compilations',
        'Current affairs analysis',
        'Trend analysis for prelims and mains'
      ],
      paymentLink: 'https://example.com/pay/current-affairs',
      createdAt: now - 172800000,
      updatedAt: now - 172800000
    },
    {
      id: '4',
      title: 'Interview Preparation Course',
      description: 'Comprehensive preparation for the UPSC CSE Personality Test (Interview) with mock interviews and feedback.',
      imageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 12999,
      duration: '2 months',
      features: [
        'Personalized DAF analysis',
        '5 mock interviews',
        'Expert feedback',
        'Group discussions'
      ],
      paymentLink: 'https://example.com/pay/interview-prep',
      createdAt: now - 259200000,
      updatedAt: now - 259200000
    },
    {
      id: '5',
      title: 'Ethics, Integrity & Aptitude Course',
      description: 'Master the ethics paper (GS Paper IV) for UPSC CSE Mains with case studies and answer writing techniques.',
      imageUrl: 'https://images.unsplash.com/photo-1605664042097-e2bd0cad0783?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 5999,
      duration: '3 months',
      features: [
        'Complete ethical theories coverage',
        '100+ case studies',
        'Answer writing practice',
        'Weekly assignments'
      ],
      paymentLink: 'https://example.com/pay/ethics-course',
      createdAt: now - 345600000,
      updatedAt: now - 345600000
    },
    {
      id: '6',
      title: 'CSAT Preparation Course',
      description: 'Focused preparation for CSAT (Civil Services Aptitude Test) with conceptual clarity and problem-solving techniques.',
      imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      price: 4999,
      duration: '2 months',
      features: [
        'Comprehensive aptitude coverage',
        'Reasoning techniques',
        'Reading comprehension strategies',
        'Time management skills'
      ],
      paymentLink: 'https://example.com/pay/csat-course',
      createdAt: now - 432000000,
      updatedAt: now - 432000000
    }
  ];
}; 