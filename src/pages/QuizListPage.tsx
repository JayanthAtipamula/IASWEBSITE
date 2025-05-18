import React from 'react';
import { Link } from 'react-router-dom';

const QuizListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              UPSC Quiz Categories
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Choose a category to practice with our specialized quizzes
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {/* Mains PYQs Card */}
            <Link to="/mains-pyqs" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg h-full">
                <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Mains PYQs</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Practice with actual questions from previous UPSC Mains examinations. Test your knowledge and improve your answer writing skills.
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                      Previous Year Questions
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View Quizzes <span aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Prelims Practice Card */}
            <Link to="/prelims-practice" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg h-full">
                <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Prelims Practice</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Enhance your MCQ solving skills with our carefully curated questions designed to prepare you for UPSC Prelims.
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                      Timed Practice
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View Quizzes <span aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Mains Practice Card */}
            <Link to="/mains-practice" className="block">
              <div className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg h-full">
                <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Mains Practice</h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Study with detailed explanations for each question. Perfect for understanding concepts and improving your answer quality.
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                      With Explanations
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View Quizzes <span aria-hidden="true">&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizListPage;