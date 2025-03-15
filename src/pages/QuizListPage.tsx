import React from 'react';
import QuizList from '../components/quiz/QuizList';

const QuizListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Quiz Platform
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Test your knowledge with our interactive quizzes on various topics
            </p>
          </div>
          
          <QuizList />
        </div>
      </div>
    </div>
  );
};

export default QuizListPage; 