import React from 'react';
import { Link } from 'react-router-dom';

// Define the Quiz type
export interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeInMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Sample quiz data
const quizzes: Quiz[] = [
  {
    id: 'general-knowledge',
    title: 'General Knowledge',
    description: 'Test your knowledge on various general topics',
    totalQuestions: 10,
    timeInMinutes: 15,
    difficulty: 'easy',
  },
  {
    id: 'science',
    title: 'Science Quiz',
    description: 'Challenge yourself with questions about science and technology',
    totalQuestions: 15,
    timeInMinutes: 20,
    difficulty: 'medium',
  },
  {
    id: 'history',
    title: 'History Quiz',
    description: 'Explore historical events and figures through this challenging quiz',
    totalQuestions: 12,
    timeInMinutes: 18,
    difficulty: 'hard',
  },
];

const QuizList: React.FC = () => {
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Quizzes
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose a quiz to test your knowledge and challenge yourself
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg"
            >
              <div className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    quiz.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800' 
                      : quiz.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{quiz.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {quiz.totalQuestions} questions
                  </div>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {quiz.timeInMinutes} minutes
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <Link 
                  to={`/quiz/${quiz.id}`} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  Start Quiz
                  <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizList; 