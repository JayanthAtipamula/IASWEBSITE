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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Question {questionNumber} of {totalQuestions}</h3>
          <p className="text-lg text-gray-700">{question.question}</p>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedAnswer === index 
                  ? 'bg-indigo-50 border-indigo-500' 
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedAnswer === index 
                    ? 'border-indigo-600 bg-indigo-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`${selectedAnswer === index ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}>
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