import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string; // Added optional explanation field
}

export type QuizType = 'mainsPyqs' | 'prelimsPractice' | 'mainsPractice';

export type ExamBoard = 'upsc' | 'tgpsc' | 'appsc';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeInMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  quizType: QuizType;
  examBoard: ExamBoard;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  questions: QuizQuestion[];
}

const COLLECTION_NAME = 'quizzes';

// Get all quizzes
export const getQuizzes = async (): Promise<Quiz[]> => {
  try {
    const quizQuery = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(quizQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Quiz;
    });
  } catch (error) {
    console.error('Error getting quizzes:', error);
    throw error;
  }
};

// Get a single quiz by ID
export const getQuizById = async (id: string): Promise<Quiz | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Quiz;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting quiz with ID ${id}:`, error);
    throw error;
  }
};

// Create a new quiz
export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...quizData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// Update an existing quiz
export const updateQuiz = async (id: string, quizData: Partial<Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...quizData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating quiz with ID ${id}:`, error);
    throw error;
  }
};

// Delete a quiz
export const deleteQuiz = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error);
    throw error;
  }
}; 