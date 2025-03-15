import React from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: (number | null)[];
  onNavigate: (questionIndex: number) => void;
  onSubmit: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  userAnswers?: (number | null)[];
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
    <div className="bg-white shadow-md rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md font-medium flex items-center ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentQuestion === totalQuestions - 1}
          className={`px-4 py-2 rounded-md font-medium flex items-center ${
            currentQuestion === totalQuestions - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors'
          }`}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="mb-2">
        <p className="text-sm text-gray-500 font-medium">
          Questions ({answeredCount}/{totalQuestions} answered)
        </p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`h-10 w-full rounded-md flex items-center justify-center font-medium transition-colors relative ${
              index === currentQuestion
                ? 'bg-indigo-600 text-white shadow-md transform scale-110 font-bold border-2 border-indigo-700'
                : answers[index] !== null
                ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {index + 1}
            {answers[index] !== null && index !== currentQuestion && (
              <span className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </span>
            )}
          </button>
        ))}
      </div>
      
      <button
        onClick={onSubmit}
        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-md"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizNavigation; 