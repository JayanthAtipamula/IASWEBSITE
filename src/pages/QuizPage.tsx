import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizNavigation from '../components/quiz/QuizNavigation';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResult from '../components/quiz/QuizResult';
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
      const progressData: QuizProgress = {
        userId: user.uid,
        quizId,
        currentQuestionIndex,
        userAnswers,
        startTime: startTime || Date.now(),
        lastUpdated: new Date()
      };
      
      if (progressId) {
        // Update existing progress document
        const progressRef = doc(db, 'quizProgress', progressId);
        await updateDoc(progressRef, {
          userId: user.uid,
          quizId,
          currentQuestionIndex,
          userAnswers,
          startTime: startTime || Date.now(),
          lastUpdated: new Date()
        });
      } else {
        // Create new progress document
        const docRef = await addDoc(collection(db, 'quizProgress'), progressData);
        setProgressId(docRef.id);
      }
    } catch (err) {
      console.error('Error saving quiz progress:', err);
    }
  };

  // Save progress whenever relevant state changes
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      saveProgress();
    }
  }, [currentQuestionIndex, userAnswers, quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    saveProgress();
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNavigate = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = (timeSpent: number) => {
    setQuizCompleted(true);
    setTimeTaken(timeSpent);
    
    // Delete progress document when quiz is completed
    if (progressId) {
      try {
        deleteDoc(doc(db, 'quizProgress', progressId));
      } catch (err) {
        console.error('Error deleting quiz progress:', err);
      }
    }
  };

  const handleTimeUp = () => {
    // Auto-submit the quiz when time is up
    handleSubmitQuiz(quiz?.timeInMinutes ? quiz.timeInMinutes * 60 : 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/quizzes')}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <QuizResult 
          questions={quiz.questions}
          userAnswers={userAnswers}
          timeTaken={timeTaken}
          quizTitle={quiz.title}
          quizId={quiz.id}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!quizStarted ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-6">{quiz.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Time Limit</p>
                <p className="text-lg font-medium">{quiz.timeInMinutes} minutes</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-lg font-medium">{quiz.questions?.length || 0} questions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="text-lg font-medium capitalize">{quiz.difficulty}</p>
              </div>
            </div>
            <button
              onClick={handleStartQuiz}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Quiz Progress at the top */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Main content with question and timer side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Question area - takes 2/3 of the space */}
            <div className="md:col-span-2">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                <div className="bg-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
                </div>
                <div className="p-6">
                  <QuizQuestion 
                    question={quiz.questions[currentQuestionIndex]}
                    selectedAnswer={userAnswers[currentQuestionIndex]}
                    onSelectAnswer={handleSelectAnswer}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={quiz.questions.length}
                  />
                </div>
              </div>
              
              <QuizNavigation 
                currentQuestion={currentQuestionIndex}
                totalQuestions={quiz.questions.length}
                answeredQuestions={userAnswers}
                onNavigate={handleNavigate}
                onNext={handleNextQuestion}
                onPrevious={handlePrevQuestion}
                onSubmit={() => handleSubmitQuiz(quiz.timeInMinutes * 60 - (quiz.timeInMinutes * 60))}
                userAnswers={userAnswers}
              />
            </div>
            
            {/* Timer area - takes 1/3 of the space */}
            <div className="md:col-span-1">
              <QuizTimer 
                startTime={startTime || Date.now()}
                totalSeconds={quiz.timeInMinutes * 60}
                onTimeUp={handleTimeUp}
                onSubmit={handleSubmitQuiz}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage; 