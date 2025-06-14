import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Quiz } from '../../services/quizService';
import { Calendar } from 'lucide-react';

interface QuizWithDate extends Omit<Quiz, 'createdAt'> {
  createdAt: Date;
}

const MainsPracticePage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizWithDate[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, 'quizzes'),
          where('quizType', '==', 'mainsPractice'),
          where('examBoard', '==', 'upsc')
        );
        
        const querySnapshot = await getDocs(q);
        const quizData: QuizWithDate[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
          quizData.push({ 
            id: doc.id, 
            ...data,
            createdAt
          } as QuizWithDate);
        });
        
        setQuizzes(quizData);
        setFilteredQuizzes(quizData);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let filtered = [...quizzes];
    
    switch (dateFilter) {
      case 'today':
        filtered = quizzes.filter(quiz => quiz.createdAt >= today);
        break;
      case 'week':
        filtered = quizzes.filter(quiz => quiz.createdAt >= weekAgo);
        break;
      case 'month':
        filtered = quizzes.filter(quiz => quiz.createdAt >= monthAgo);
        break;
      default:
        filtered = quizzes;
    }
    
    setFilteredQuizzes(filtered);
  }, [dateFilter, quizzes]);

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            UPSC Mains Practice
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Practice with detailed explanations for UPSC Mains preparation
          </p>
        </div>

        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              Filter by date:
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  dateFilter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Quizzes
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  dateFilter === 'today'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  dateFilter === 'week'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  dateFilter === 'month'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>
        
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {dateFilter === 'all' 
                ? 'No quizzes available at the moment. Please check back later.'
                : `No quizzes found for the selected time period (${dateFilter}). Try a different filter or check back later.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                onClick={() => handleQuizClick(quiz.id)}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{quiz.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{quiz.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                        {quiz.totalQuestions} Questions
                      </span>
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Self-paced
                      </span>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs font-medium rounded-full 
                      ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Start Practice <span aria-hidden="true">&rarr;</span>
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

export default MainsPracticePage;
