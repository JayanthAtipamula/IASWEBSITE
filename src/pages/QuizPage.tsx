import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizNavigation from '../components/quiz/QuizNavigation';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResult from '../components/quiz/QuizResult';
import QuizDetails from '../components/quiz/QuizDetails';
import { getQuizById, Quiz, QuizQuestion as QuizQuestionType } from '../services/quizService';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface QuizProgress {
  id?: string;
  userId: string;
  quizId: string;
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  startTime: number;
  lastUpdated: Date;
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Load quiz data and any existing progress from database
  useEffect(() => {
    if (!quizId) {
      setError('Quiz ID is missing');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to take a quiz');
      setLoading(false);
      return;
    }

    const fetchQuizAndProgress = async () => {
      try {
        // Fetch quiz data
        const quizData = await getQuizById(quizId);
        if (!quizData) {
          setError('Quiz not found');
          setLoading(false);
          return;
        }
        
        setQuiz(quizData);
        
        // Check for existing progress in database
        const progressQuery = query(
          collection(db, 'quizProgress'),
          where('userId', '==', user.uid),
          where('quizId', '==', quizId)
        );
        
        const progressSnapshot = await getDocs(progressQuery);
        
        if (!progressSnapshot.empty) {
          // Found existing progress
          const progressData = progressSnapshot.docs[0].data() as QuizProgress;
          setProgressId(progressSnapshot.docs[0].id);
          setCurrentQuestionIndex(progressData.currentQuestionIndex);
          setUserAnswers(progressData.userAnswers);
          setQuizStarted(true);
          setStartTime(progressData.startTime);
        } else {
          // No existing progress, initialize with defaults
          setUserAnswers(Array(quizData.questions.length).fill(null));
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndProgress();
  }, [quizId, user]);

  // Save quiz progress to database
  const saveProgress = async () => {
    if (!user || !quizId || !quiz || quizCompleted) return;
    
    try {
      const progressData = {
        userId: user.uid,
        quizId,
        currentQuestionIndex,
        userAnswers,
        startTime: startTime || Date.now(),
        lastUpdated: new Date()
      };
      
      if (progressId) {
        // Update existing progress
        await updateDoc(doc(db, 'quizProgress', progressId), progressData);
      } else {
        // Create new progress
        const docRef = await addDoc(collection(db, 'quizProgress'), progressData);
        setProgressId(docRef.id);
      }
    } catch (err) {
      console.error('Error saving quiz progress:', err);
    }
  };

  // Save progress when component unmounts or when relevant state changes
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      saveProgress();
    }
    
    // Save progress when component unmounts
    return () => {
      if (quizStarted && !quizCompleted) {
        saveProgress();
      }
    };
  }, [currentQuestionIndex, userAnswers, quizStarted, quizCompleted]);

  // Handle starting the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  // Handle selecting an answer
  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  // Handle navigating to a specific question
  const handleNavigate = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle moving to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle submitting the quiz
  const handleSubmitQuiz = async (timeSpent?: number) => {
    if (timeSpent) {
      setTimeTaken(timeSpent);
    } else {
      // Calculate time taken if not provided
      const endTime = Date.now();
      const timeElapsed = Math.floor((endTime - (startTime || endTime)) / 1000);
      setTimeTaken(timeElapsed);
    }
    
    setQuizCompleted(true);
    
    // Delete progress from database since quiz is completed
    if (progressId) {
      try {
        await deleteDoc(doc(db, 'quizProgress', progressId));
      } catch (err) {
        console.error('Error deleting quiz progress:', err);
      }
    }
  };

  // Handle when time is up
  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/quizzes')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (quizCompleted) {
    return (
      <QuizResult
        quiz={quiz}
        userAnswers={userAnswers}
        timeTaken={timeTaken}
      />
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <QuizDetails quiz={quiz} onStartQuiz={handleStartQuiz} />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <QuizQuestion
              question={currentQuestion}
              selectedAnswer={userAnswers[currentQuestionIndex]}
              onSelectAnswer={handleSelectAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quiz.questions.length}
            />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <QuizTimer
              startTime={startTime || Date.now()}
              totalSeconds={quiz.timeInMinutes * 60}
              onTimeUp={handleTimeUp}
            />
            
            <QuizNavigation
              currentQuestion={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              answeredQuestions={userAnswers}
              onNavigate={handleNavigate}
              onSubmit={() => handleSubmitQuiz()}
              onPrevious={handlePrevQuestion}
              onNext={handleNextQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 