import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User, Clock, Calendar, Search, Download } from 'lucide-react';

interface QuizAttempt {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: Date;
  device?: {
    userAgent: string;
    platform: string;
  };
  answers?: Record<string, any>[];
}

const QuizAttempts: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        setLoading(true);
        
        // Create query for all attempts, ordered by completion date
        const attemptsQuery = query(
          collection(db, 'quizAttempts'),
          orderBy('completedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(attemptsQuery);
        const attemptsList: QuizAttempt[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          attemptsList.push({
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail || 'Unknown',
            userDisplayName: data.userDisplayName || 'Unknown User',
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            score: data.score,
            totalQuestions: data.totalQuestions,
            timeTaken: data.timeTaken,
            completedAt: data.completedAt.toDate(),
            device: data.device,
            answers: data.answers
          });
        });
        
        setAttempts(attemptsList);
        setFilteredAttempts(attemptsList);
      } catch (err) {
        console.error('Error fetching quiz attempts:', err);
        setError('Failed to load quiz attempts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAttempts();
  }, []);
  
  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = [...attempts];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        attempt => 
          attempt.userDisplayName.toLowerCase().includes(term) ||
          attempt.userEmail.toLowerCase().includes(term) ||
          attempt.quizTitle.toLowerCase().includes(term)
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'custom':
          // Custom date range filtering
          if (fromDate && toDate) {
            const fromDateTime = new Date(fromDate);
            fromDateTime.setHours(0, 0, 0, 0);
            const toDateTime = new Date(toDate);
            toDateTime.setHours(23, 59, 59, 999);
            
            filtered = filtered.filter(attempt => {
              const attemptDate = attempt.completedAt;
              return attemptDate >= fromDateTime && attemptDate <= toDateTime;
            });
          } else if (fromDate) {
            const fromDateTime = new Date(fromDate);
            fromDateTime.setHours(0, 0, 0, 0);
            filtered = filtered.filter(attempt => attempt.completedAt >= fromDateTime);
          } else if (toDate) {
            const toDateTime = new Date(toDate);
            toDateTime.setHours(23, 59, 59, 999);
            filtered = filtered.filter(attempt => attempt.completedAt <= toDateTime);
          }
          return; // Exit early for custom date range
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      if (dateFilter !== 'custom') {
        filtered = filtered.filter(attempt => attempt.completedAt >= startDate);
      }
    }
    
    // Apply score filter
    if (scoreFilter !== 'all') {
      switch (scoreFilter) {
        case 'high':
          filtered = filtered.filter(attempt => 
            (attempt.score / attempt.totalQuestions) * 100 >= 80
          );
          break;
        case 'medium':
          filtered = filtered.filter(attempt => {
            const percentage = (attempt.score / attempt.totalQuestions) * 100;
            return percentage >= 50 && percentage < 80;
          });
          break;
        case 'low':
          filtered = filtered.filter(attempt => 
            (attempt.score / attempt.totalQuestions) * 100 < 50
          );
          break;
      }
    }
    
    setFilteredAttempts(filtered);
  }, [searchTerm, dateFilter, scoreFilter, attempts, fromDate, toDate]);
  
  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Export attempts to CSV
  const exportToCSV = () => {
    // Create CSV header
    let csv = 'User,Email,Quiz,Score,Percentage,Time Taken,Completed At\n';
    
    // Add each attempt as a row
    filteredAttempts.forEach(attempt => {
      const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
      const row = [
        `"${attempt.userDisplayName}"`,
        `"${attempt.userEmail}"`,
        `"${attempt.quizTitle}"`,
        `${attempt.score}/${attempt.totalQuestions}`,
        `${percentage}%`,
        formatTime(attempt.timeTaken),
        formatDate(attempt.completedAt)
      ].join(',');
      
      csv += row + '\n';
    });
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `quiz-attempts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Quiz Attempts</h1>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className={`grid grid-cols-1 gap-4 ${dateFilter === 'custom' ? 'md:grid-cols-6' : 'md:grid-cols-4'}`}>
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search users or quizzes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Date Filter */}
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <select
              id="date-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          
          {/* Score Filter */}
          <div>
            <label htmlFor="score-filter" className="block text-sm font-medium text-gray-700">
              Score
            </label>
            <select
              id="score-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
            >
              <option value="all">All Scores</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (50-79%)</option>
              <option value="low">Low (Below 50%)</option>
            </select>
          </div>
          
          {/* Custom Date Range Fields */}
          {dateFilter === 'custom' && (
            <>
              <div>
                <label htmlFor="from-date" className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  id="from-date"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDate || undefined}
                />
              </div>
              
              <div>
                <label htmlFor="to-date" className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  id="to-date"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || undefined}
                />
              </div>
            </>
          )}
          
          {/* Results Count */}
          <div className="flex items-end">
            <span className="text-sm text-gray-500">
              Showing {filteredAttempts.length} of {attempts.length} attempts
            </span>
          </div>
        </div>
      </div>
      
      {/* Attempts List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredAttempts.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No quiz attempts match your filters.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAttempts.map((attempt) => (
              <li key={attempt.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <User className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-600">
                          {attempt.userDisplayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.userEmail}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (attempt.score / attempt.totalQuestions) * 100 >= 70
                          ? 'bg-green-100 text-green-800'
                          : (attempt.score / attempt.totalQuestions) * 100 >= 40
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attempt.score}/{attempt.totalQuestions} ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1 font-medium">Quiz:</span> {attempt.quizTitle}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span className="mr-4">Time: {formatTime(attempt.timeTaken)}</span>
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>Completed: {formatDate(attempt.completedAt)}</span>
                    </div>
                  </div>
                  {attempt.device && (
                    <div className="mt-2 text-xs text-gray-500">
                      Device: {attempt.device.platform} • {attempt.device.userAgent.substring(0, 50)}...
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuizAttempts; 