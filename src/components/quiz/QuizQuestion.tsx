import React from 'react';
import { QuizType } from '../../services/quizService';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
  quizType?: QuizType;
  showAnswer?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
  quizType,
  showAnswer,
}) => {
  const isMainsPractice = quizType === 'mainsPractice';
  const shouldShowAnswer = showAnswer || (isMainsPractice && selectedAnswer !== null);

  const getOptionClass = (index: number) => {
    if (shouldShowAnswer) {
      if (index === question.correctAnswer) {
        return 'bg-green-50 border-green-500'; // Correct answer
      }
      if (index === selectedAnswer) {
        return 'bg-red-50 border-red-500'; // Incorrect selected answer
      }
      return 'border-gray-200'; // Other options
    }
    // Default selection style
    if (selectedAnswer === index) {
      return 'bg-indigo-50 border-indigo-500';
    }
    return 'hover:bg-gray-50 border-gray-200';
  };

  const handleOptionClick = (index: number) => {
    if (isMainsPractice && selectedAnswer !== null) {
      // Don't allow changing answer in mains practice once selected
      return;
    }
    onSelectAnswer(index);
  };

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
              onClick={() => handleOptionClick(index)}
              className={`p-4 border rounded-lg transition-all ${ (isMainsPractice && selectedAnswer !== null) ? 'cursor-default' : 'cursor-pointer'} ${
                getOptionClass(index)
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedAnswer === index && !shouldShowAnswer 
                    ? 'border-indigo-600 bg-indigo-600' 
                    : (shouldShowAnswer && index === question.correctAnswer ? 'border-green-600 bg-green-600' : 'border-gray-300')
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`${ (selectedAnswer === index && !shouldShowAnswer) ? 'text-indigo-700 font-medium' : ((shouldShowAnswer && index === question.correctAnswer) ? 'text-green-700 font-medium' : ((shouldShowAnswer && index === selectedAnswer ) ? 'text-red-700 font-medium' : 'text-gray-700'))}`}>
                  {option}
                </span>
              </div>
            </div>
          ))}
        </div>

        {shouldShowAnswer && question.explanation && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-1">Explanation:</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion; 