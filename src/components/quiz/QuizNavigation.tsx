import React from 'react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: (number | null)[];
  onNavigate: (questionIndex: number) => void;
  onSubmit: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onNavigate,
  onSubmit,
}) => {
  // Calculate progress percentage
  const progress = Math.round((answeredQuestions.filter(a => a !== null).length / totalQuestions) * 100);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Quiz Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          {answeredQuestions.filter(a => a !== null).length} of {totalQuestions} questions answered
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Question Navigation</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium
                ${currentQuestion === i 
                  ? 'bg-indigo-600 text-white' 
                  : answeredQuestions[i] !== null
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-auto">
        <button
          onClick={() => onNavigate(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Previous
        </button>
        
        {currentQuestion < totalQuestions - 1 ? (
          <button
            onClick={() => onNavigate(currentQuestion + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizNavigation; 