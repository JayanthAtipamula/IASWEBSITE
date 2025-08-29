import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../services/quizService';
import { Quiz } from '../services/quizService-server';
import LoadingScreen from '../components/LoadingScreen';

interface QuizListPageProps {
  initialData?: any;
}

const QuizListPage: React.FC<QuizListPageProps> = ({ initialData }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Use initial data from SSR if available
    if (initialData && initialData.quizzes) {
      setQuizzes(initialData.quizzes);
      setLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (!isClient) return;

    // Skip fetching if we already have SSR data
    if (initialData && initialData.quizzes) return;

    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const quizzesData = await getQuizzes();
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [isClient, initialData]);

  // Don't show loading screen during SSR, only on client side
  if (loading && isClient) {
    return <LoadingScreen />;
  }

  // Group quizzes by type
  const mainsPyqs = quizzes.filter(q => q.quizType === 'mainsPyqs');
  const prelimsPractice = quizzes.filter(q => q.quizType === 'prelimsPractice');
  const mainsPractice = quizzes.filter(q => q.quizType === 'mainsPractice');

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
                      {mainsPyqs.length} Quizzes Available
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
                      {prelimsPractice.length} Quizzes Available
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
                      {mainsPractice.length} Quizzes Available
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

          {/* Display actual quizzes if available */}
          {quizzes.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Available Quizzes</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{quiz.totalQuestions} questions</span>
                      <span>{quiz.timeInMinutes} min</span>
                      <span className="capitalize">{quiz.difficulty}</span>
                    </div>
                    <Link 
                      to={`/quiz/${quiz.id}`}
                      className="mt-4 inline-block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Start Quiz
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizListPage;