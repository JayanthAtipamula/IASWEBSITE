import React from 'react';
import { Quiz } from '../../services/quizService';

interface QuizDetailsProps {
  quiz: Quiz;
  onStartQuiz: () => void;
}

const QuizDetails: React.FC<QuizDetailsProps> = ({ quiz, onStartQuiz }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
        <p className="text-lg text-gray-600">{quiz.description}</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2"></span>
            <span>Read each question carefully before answering.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2"></span>
            <span>You can navigate between questions using the navigation panel.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2"></span>
            <span>The timer will start as soon as you begin the quiz.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2"></span>
            <span>Your quiz will be automatically submitted when the time is up.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-2"></span>
            <span>You can review and change your answers before submitting.</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="text-lg font-semibold text-gray-800">{quiz.questions?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time Limit</p>
              <p className="text-lg font-semibold text-gray-800">{quiz.timeInMinutes} minutes</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onStartQuiz}
        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizDetails; 