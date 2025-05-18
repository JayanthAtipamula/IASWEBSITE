import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuizType } from '../../services/quizService';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: (number | null)[];
  onNavigate: (questionIndex: number) => void;
  onSubmit: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  userAnswers?: (number | null)[];
  quizType?: QuizType;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onNavigate,
  onSubmit,
  onPrevious,
  onNext,
  userAnswers,
  quizType,
}) => {
  // Use either answeredQuestions or userAnswers based on which is provided
  const answers = userAnswers || answeredQuestions;
  
  // Handle previous and next navigation
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      onNavigate(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      onNavigate(currentQuestion + 1);
    }
  };
  
  // Calculate how many questions have been answered
  const answeredCount = answers.filter(a => a !== null).length;
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigation</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-3 py-1 rounded-md font-medium flex items-center text-sm ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentQuestion === totalQuestions - 1}
            className={`px-3 py-1 rounded-md font-medium flex items-center text-sm ${
              currentQuestion === totalQuestions - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors'
            }`}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        <p className="text-sm text-gray-500 font-medium">
          Quiz Progress
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 mb-3">
          <div 
            className="h-1.5 rounded-full bg-green-500" 
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          {answeredCount} of {totalQuestions} questions answered
        </p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`h-9 w-full rounded-md flex items-center justify-center font-medium text-sm transition-colors ${
              index === currentQuestion
                ? 'bg-indigo-600 text-white'
                : answers[index] !== null
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <button
        onClick={onSubmit}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
      >
        {quizType === 'mainsPractice' ? 'Finish Review' : 'Submit Quiz'}
      </button>
    </div>
  );
};

export default QuizNavigation; 