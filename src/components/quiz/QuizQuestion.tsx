import React from 'react';

export interface Question {
  id: string;
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
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>
        
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAnswer === index 
                  ? 'bg-indigo-50 border-indigo-500 shadow-md transform scale-[1.02]' 
                  : 'hover:bg-gray-50 border-gray-200 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                  selectedAnswer === index 
                    ? 'border-indigo-600 bg-indigo-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`${selectedAnswer === index ? 'text-indigo-800 font-medium' : 'text-gray-700'}`}>
                  {option}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion; 