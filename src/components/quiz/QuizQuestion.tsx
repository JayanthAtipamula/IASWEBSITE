import React from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Question {questionNumber} of {totalQuestions}
        </h3>
      </div>
      
      <div className="mb-8">
        <p className="text-xl font-semibold text-gray-800">{question.question}</p>
      </div>
      
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedAnswer === index
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-5 w-5 mr-3 rounded-full border ${
                selectedAnswer === index
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-base">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion; 