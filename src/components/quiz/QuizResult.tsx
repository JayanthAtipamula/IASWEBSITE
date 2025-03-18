import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Quiz, QuizQuestion } from '../../services/quizService';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface QuizResultProps {
  quiz: Quiz;
  userAnswers: (number | null)[];
  timeTaken: number;
}

const QuizResult: React.FC<QuizResultProps> = ({
  quiz,
  userAnswers,
  timeTaken,
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const questions = quiz.questions;
  
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
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: correctAnswers,
          scorePercentage: score,
          totalQuestions: questions.length,
          timeTaken,
          timestamp: serverTimestamp(),
          userAnswers,
        });
        
        setSaved(true);
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        setSaveError('Failed to save your quiz results. Please try again later.');
      }
    };
    
    saveQuizAttempt();
  }, [user, quiz, questions, userAnswers, correctAnswers, score, timeTaken, saved]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };
  
  // Get appropriate message based on score
  const getResultMessage = (): { title: string; message: string; color: string } => {
    if (score >= 90) {
      return {
        title: 'Excellent!',
        message: 'You have an exceptional understanding of this topic!',
        color: 'text-green-600',
      };
    } else if (score >= 70) {
      return {
        title: 'Great Job!',
        message: 'You have a good grasp of this topic.',
        color: 'text-green-600',
      };
    } else if (score >= 50) {
      return {
        title: 'Good Effort!',
        message: 'You have a basic understanding of this topic.',
        color: 'text-yellow-600',
      };
    } else {
      return {
        title: 'Keep Learning!',
        message: 'This topic needs more study. Don\'t give up!',
        color: 'text-red-600',
      };
    }
  };
  
  const resultMessage = getResultMessage();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Results</h1>
            <p className="text-indigo-100">{quiz.title}</p>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-indigo-50 mb-4">
                <span className="text-4xl font-bold text-indigo-600">{score}%</span>
              </div>
              <h2 className={`text-2xl font-bold ${resultMessage.color} mb-2`}>{resultMessage.title}</h2>
              <p className="text-gray-600">{resultMessage.message}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">Score</p>
                <p className="text-xl font-semibold text-gray-800">{correctAnswers} / {questions.length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                <p className="text-xl font-semibold text-gray-800">{formatTime(timeTaken)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-1">Accuracy</p>
                <p className="text-xl font-semibold text-gray-800">{score}%</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <p className="font-medium text-gray-800 mb-4">
                      {index + 1}. {question.question}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-3 rounded-md ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-100 border border-green-300'
                              : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-500 text-white'
                                : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer
                                ? 'bg-red-500 text-white'
                                : 'border border-gray-300'
                            }`}>
                              {optionIndex === question.correctAnswer && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`${
                              optionIndex === question.correctAnswer
                                ? 'text-green-800 font-medium'
                                : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer
                                ? 'text-red-800 font-medium'
                                : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`text-sm ${
                      userAnswers[index] === question.correctAnswer
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {userAnswers[index] === question.correctAnswer
                        ? '✓ Correct answer'
                        : userAnswers[index] === null
                        ? '✗ Not answered'
                        : '✗ Incorrect answer'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link
                to="/quizzes"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Back to Quizzes
              </Link>
              <Link
                to={`/quiz/${quiz.id}`}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Retry Quiz
              </Link>
            </div>
            
            {saveError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {saveError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 