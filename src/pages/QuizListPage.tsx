import React from 'react';
import QuizList from '../components/quiz/QuizList';

const QuizListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizList />
        </div>
      </div>
    </div>
  );
};

export default QuizListPage; 