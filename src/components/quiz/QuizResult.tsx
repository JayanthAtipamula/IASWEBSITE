import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from './QuizQuestion';

interface QuizResultProps {
  questions: Question[];
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
  // Calculate score
  const correctAnswers = questions.filter(
    (question, index) => userAnswers[index] === question.correctAnswer
  ).length;
  
  const score = Math.round((correctAnswers / questions.length) * 100);
  
  // Format time taken
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };
  
  // Get result message based on score
  const getResultMessage = (): { title: string; message: string } => {
    if (score >= 90) {
      return {
        title: 'Excellent!',
        message: 'You have an exceptional understanding of this subject!',
      };
    } else if (score >= 70) {
      return {
        title: 'Great job!',
        message: 'You have a solid understanding of this subject.',
      };
    } else if (score >= 50) {
      return {
        title: 'Good effort!',
        message: 'You have a basic understanding of this subject, but there\'s room for improvement.',
      };
    } else {
      return {
        title: 'Keep practicing!',
        message: 'This subject needs more of your attention. Don\'t give up!',
      };
    }
  };
  
  const resultMessage = getResultMessage();
  
  // Clear any saved quiz state before retrying
  const handleRetry = () => {
    localStorage.removeItem(`quiz_${quizId}_state`);
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{quizTitle} - Results</h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative">
            <svg className="w-32 h-32" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2"></circle>
              <circle 
                cx="18" cy="18" r="16" 
                fill="none" 
                stroke={score >= 70 ? '#48bb78' : score >= 50 ? '#ecc94b' : '#f56565'} 
                strokeWidth="2" 
                strokeDasharray="100" 
                strokeDashoffset={100 - score} 
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{score}%</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mt-4 text-gray-800">{resultMessage.title}</h3>
          <p className="text-gray-600 text-center mt-1">{resultMessage.message}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Correct Answers</p>
              <p className="text-xl font-semibold text-gray-800">{correctAnswers} / {questions.length}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Time Taken</p>
              <p className="text-xl font-semibold text-gray-800">{formatTime(timeTaken)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`p-4 rounded-lg border ${
                  userAnswers[index] === question.correctAnswer
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p className="font-medium text-gray-800">{index + 1}. {question.question}</p>
                <div className="mt-2 space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`p-2 rounded ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-50 text-gray-800'
                      }`}
                    >
                      {option}
                      {optionIndex === question.correctAnswer && (
                        <span className="ml-2 text-green-600">✓ Correct Answer</span>
                      )}
                      {optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer && (
                        <span className="ml-2 text-red-600">✗ Your Answer</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link 
            to="/quizzes" 
            className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
          >
            Back to Quizzes
          </Link>
          <Link 
            to={`/quiz/${quizId}`} 
            onClick={handleRetry}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200"
          >
            Retry Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 