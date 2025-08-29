import { adminDb } from '../config/firebase-admin';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
  createdAt: any;
  updatedAt: any;
  questions: QuizQuestion[];
}

// Server-side quiz service for SSR
export const getQuizzesServer = async (): Promise<Quiz[]> => {
  try {
    console.log('Server: Fetching quizzes from Firestore...');
    const quizQuery = adminDb.collection('quizzes').orderBy('createdAt', 'desc');
    const querySnapshot = await quizQuery.get();
    
    console.log(`Server: Fetched ${querySnapshot.docs.length} quizzes`);
    
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
    console.error('Server-side error getting quizzes:', error);
    return [];
  }
};

export const getQuizByIdServer = async (id: string): Promise<Quiz | null> => {
  try {
    const docRef = adminDb.collection('quizzes').doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
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
    console.error(`Server-side error getting quiz with ID ${id}:`, error);
    return null;
  }
};

export const getQuizzesByTypeServer = async (quizType: QuizType): Promise<Quiz[]> => {
  try {
    const quizQuery = adminDb.collection('quizzes')
      .where('quizType', '==', quizType)
      .orderBy('createdAt', 'desc');
    const querySnapshot = await quizQuery.get();
    
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
    console.error(`Server-side error getting quizzes by type ${quizType}:`, error);
    return [];
  }
};

export const getQuizzesByExamBoardServer = async (examBoard: ExamBoard): Promise<Quiz[]> => {
  try {
    const quizQuery = adminDb.collection('quizzes')
      .where('examBoard', '==', examBoard)
      .orderBy('createdAt', 'desc');
    const querySnapshot = await quizQuery.get();
    
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
    console.error(`Server-side error getting quizzes by exam board ${examBoard}:`, error);
    return [];
  }
};
