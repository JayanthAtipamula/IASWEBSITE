import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, Quiz } from '../../services/quizService';
import { useAuth } from '../../contexts/AuthContext';

// Sample quiz data has been removed in favor of Firebase data

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Quizzes
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Test your knowledge with our collection of quizzes
          </p>
          
          {!user && (
            <div className="mt-6 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-lg mx-auto max-w-2xl">
              <p className="font-medium">
                <span className="font-bold">Note:</span> You need to be logged in to take quizzes and save your results.
              </p>
              <Link 
                to="/login" 
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in to continue
              </Link>
            </div>
          )}
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quizzes available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{quiz.questions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Limit:</span>
                      <span className="font-medium">{quiz.timeInMinutes} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`font-medium ${
                        quiz.difficulty === 'easy' ? 'text-green-600' :
                        quiz.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    {user ? (
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="w-full inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Start Quiz
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full inline-block px-4 py-2 bg-gray-400 text-white font-medium rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Sign in to take quiz
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList; 