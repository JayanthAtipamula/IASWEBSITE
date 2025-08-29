import { adminDb } from '../config/firebase-admin';
import { Course } from '../types/course';

// Server-side course service for SSR
export const getCoursesServer = async (): Promise<Course[]> => {
  try {
    console.log('Server: Fetching courses from Firestore...');
    const coursesRef = adminDb.collection('courses');
    const q = coursesRef.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    console.log(`Server: Fetched ${snapshot.docs.length} courses`);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        examType: data.examType || 'upsc'
      } as Course;
    });
  } catch (error) {
    console.error('Server-side error fetching courses:', error);
    return [];
  }
};

export const getCourseByIdServer = async (id: string): Promise<Course | null> => {
  try {
    const courseRef = adminDb.collection('courses').doc(id);
    const courseSnap = await courseRef.get();
    
    if (courseSnap.exists) {
      return { id: courseSnap.id, ...courseSnap.data() } as Course;
    } else {
      console.log('Server: No such course!');
      return null;
    }
  } catch (error) {
    console.error('Server-side error fetching course:', error);
    return null;
  }
};

export const getCoursesByExamTypeServer = async (examType: string): Promise<Course[]> => {
  try {
    const coursesRef = adminDb.collection('courses');
    const q = coursesRef.where('examType', '==', examType).orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  } catch (error) {
    console.error('Server-side error fetching courses by exam type:', error);
    return [];
  }
};
