import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Quiz } from '../../services/quizService';
import { Calendar, Filter } from 'lucide-react';

const APPSCPrelimsPracticePage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Query quizzes with quizType = 'prelimsPractice' and examBoard = 'appsc'
        const q = query(
          collection(db, 'quizzes'),
          where('quizType', '==', 'prelimsPractice'),
          where('examBoard', '==', 'appsc')
        );
        
        const querySnapshot = await getDocs(q);
        const quizData: Quiz[] = [];
        
        querySnapshot.forEach((doc) => {
          quizData.push({ id: doc.id, ...doc.data() } as Quiz);
        });
        
        setQuizzes(quizData);
        setFilteredQuizzes(quizData); // Initialize filtered quizzes with all quizzes
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Filter quizzes based on selected date range
  useEffect(() => {
    if (quizzes.length === 0) return;

    const now = new Date();
    let filtered = [...quizzes];

    switch (dateFilter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = quizzes.filter(quiz => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= today;
        });
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter(quiz => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = quizzes.filter(quiz => {
          const quizDate = quiz.createdAt.toDate();
          return quizDate >= monthAgo;
        });
        break;
      case 'all':
      default:
        // No filter, show all
        break;
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            APPSC Prelims Practice
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Practice with carefully curated questions to prepare for APPSC Prelims
          </p>
        </div>
        
        {/* Date Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filter by date:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Quizzes
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'today' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Today
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'week' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1" />
                This Week
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'month' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Calendar className="h-3.5 w-3.5 mr-1" />
                This Month
              </button>
            </div>
          </div>
          {dateFilter !== 'all' && (
            <div className="mt-3 text-sm text-gray-500 text-center sm:text-right">
              Showing {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'} from {dateFilter === 'today' ? 'today' : dateFilter === 'week' ? 'the past 7 days' : 'the past 30 days'}
            </div>
          )}
        </div>
        
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No quizzes available at the moment. Please check back later.</p>
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
                        {quiz.timeInMinutes} Minutes
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
                    Start Quiz <span aria-hidden="true">&rarr;</span>
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

export default APPSCPrelimsPracticePage;
