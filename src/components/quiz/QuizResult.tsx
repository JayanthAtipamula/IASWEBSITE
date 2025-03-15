import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Quiz, QuizQuestion } from '../../services/quizService';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface QuizResultProps {
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  timeTaken: number;
  quizTitle: string;
  quizId: string;
}

const QuizResult: React.FC<QuizResultProps> = ({
  questions,
  userAnswers,
  timeTaken,
  quizTitle,
  quizId,
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Calculate score
  const correctAnswers = questions.filter(
    (question, index) => userAnswers[index] === question.correctAnswer
  ).length;
  
  const score = Math.round((correctAnswers / questions.length) * 100);
  
  // Save quiz attempt to Firestore
  useEffect(() => {
    const saveQuizAttempt = async () => {
      if (!user) return; // Only save for authenticated users
      
      try {
        // Check if we've already saved this attempt (prevent duplicate saves on re-renders)
        if (saved) return;
        
        await addDoc(collection(db, 'quizAttempts'), {
          userId: user.uid,
          userEmail: user.email,
          userDisplayName: user.displayName || 'Anonymous User',
          quizId,
          quizTitle,
          score: correctAnswers,
          scorePercentage: score,
          totalQuestions: questions.length,
          userAnswers,
          timeTaken,
          completedAt: serverTimestamp(),
          device: {
            userAgent: navigator.userAgent,
            platform: navigator.platform
          }
        });
        
        setSaved(true);
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        setSaveError('Failed to save your quiz results.');
      }
    };
    
    saveQuizAttempt();
  }, [user, quizId, quizTitle, correctAnswers, questions.length, userAnswers, timeTaken, saved]);
  
  // Format time taken
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };
  
  // Get result message based on score
  const getResultMessage = (): { title: string; message: string; color: string } => {
    if (score >= 90) {
      return {
        title: 'Excellent!',
        message: 'You have an exceptional understanding of this subject!',
        color: 'text-green-600',
      };
    } else if (score >= 70) {
      return {
        title: 'Great Job!',
        message: 'You have a solid understanding of this subject.',
        color: 'text-green-600',
      };
    } else if (score >= 50) {
      return {
        title: 'Good Effort!',
        message: 'You have a basic understanding, but there\'s room for improvement.',
        color: 'text-yellow-600',
      };
    } else {
      return {
        title: 'Keep Learning!',
        message: 'This subject needs more study. Don\'t give up!',
        color: 'text-red-600',
      };
    }
  };
  
  const resultMessage = getResultMessage();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Quiz Results</h2>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{quizTitle}</h3>
          
          {saveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {saveError}
            </div>
          )}
          
          {user && saved && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Your results have been saved to your profile.
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-50 mb-2">
                <span className="text-3xl font-bold text-indigo-600">{score}%</span>
              </div>
              <h4 className={`text-xl font-bold ${resultMessage.color}`}>{resultMessage.title}</h4>
              <p className="text-gray-600">{resultMessage.message}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-xl font-semibold">{correctAnswers} of {questions.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Time Taken</p>
                <p className="text-xl font-semibold">{formatTime(timeTaken)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <Link 
              to="/quizzes" 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
            >
              Back to Quizzes
            </Link>
            <Link 
              to={`/quiz/${quizId}`} 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
            >
              Retry Quiz
            </Link>
            {user && (
              <Link 
                to="/profile" 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                View Profile
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Review Answers</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-8">
            {questions.map((question, questionIndex) => (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 text-indigo-800 font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">
                    {questionIndex + 1}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">{question.question}</h4>
                </div>
                
                <div className="ml-9 space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-3 rounded-lg ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-50 border border-green-200'
                          : userAnswers[questionIndex] === optionIndex
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {optionIndex === question.correctAnswer ? (
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : userAnswers[questionIndex] === optionIndex ? (
                          <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <div className="h-5 w-5 mr-2"></div>
                        )}
                        <span className={`${
                          optionIndex === question.correctAnswer
                            ? 'text-green-800'
                            : userAnswers[questionIndex] === optionIndex
                              ? 'text-red-800'
                              : 'text-gray-800'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {userAnswers[questionIndex] === null && (
                    <div className="text-yellow-600 italic">
                      You did not answer this question.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 