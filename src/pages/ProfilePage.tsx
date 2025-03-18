import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, LogOut, Award, Clock, BarChart, Calendar, RefreshCw } from 'lucide-react';
import QuizStats from '../components/quiz/QuizStats';

interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeTaken: number;
}

interface PerformanceSummary {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalQuizzesTaken: number;
  averageTime: number;
}

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PerformanceSummary>({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuizzesTaken: 0,
    averageTime: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchQuizAttempts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Remove the orderBy clause which might be causing issues
        const attemptsQuery = query(
          collection(db, 'quizAttempts'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(attemptsQuery);
        const attempts: QuizAttempt[] = [];
        
        // For calculating summary
        let totalScore = 0;
        let bestScore = 0;
        let totalTime = 0;
        const uniqueQuizzes = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          try {
            const data = doc.data();
            
            // Skip invalid data
            if (!data.quizId || !data.quizTitle || data.score === undefined || 
                data.totalQuestions === undefined || !data.completedAt) {
              console.warn('Skipping invalid quiz attempt data:', data);
              return;
            }
            
            // Convert Firestore timestamp to Date if needed
            const completedAt = data.completedAt instanceof Date 
              ? data.completedAt 
              : data.completedAt.toDate ? data.completedAt.toDate() : new Date();
            
            attempts.push({
              id: doc.id,
              quizId: data.quizId,
              quizTitle: data.quizTitle,
              score: data.score,
              totalQuestions: data.totalQuestions,
              completedAt: completedAt,
              timeTaken: data.timeTaken || 0
            });
            
            // Calculate summary data
            const scorePercentage = (data.score / data.totalQuestions) * 100;
            totalScore += scorePercentage;
            bestScore = Math.max(bestScore, scorePercentage);
            totalTime += data.timeTaken || 0;
            uniqueQuizzes.add(data.quizId);
          } catch (docErr) {
            console.error('Error processing quiz attempt document:', docErr);
          }
        });
        
        // Sort attempts by date (newest first) since we removed orderBy
        attempts.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
        
        setQuizAttempts(attempts);
        
        // Set performance summary
        if (attempts.length > 0) {
          setSummary({
            totalAttempts: attempts.length,
            averageScore: Math.round(totalScore / attempts.length),
            bestScore: Math.round(bestScore),
            totalQuizzesTaken: uniqueQuizzes.size,
            averageTime: Math.round(totalTime / attempts.length)
          });
        }
      } catch (err) {
        console.error('Error fetching quiz attempts:', err);
        setError('Failed to load your quiz history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAttempts();
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

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

  // Add handleRetry function
  const handleRetry = () => {
    if (user) {
      fetchQuizAttempts();
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="bg-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mr-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <User className="w-10 h-10 text-indigo-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.displayName || 'User'}</h1>
                <p className="text-indigo-100">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-auto flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>

          {/* Quiz Statistics */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Quiz Statistics</h2>
            {user && <QuizStats userId={user.uid} />}
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Your Quiz History</h2>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                <p>{error}</p>
                <button 
                  onClick={handleRetry}
                  className="flex items-center text-red-700 hover:text-red-900"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : quizAttempts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't completed any quizzes yet.</p>
                <button
                  onClick={() => navigate('/quizzes')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Browse Quizzes
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Taken
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizAttempts.map((attempt) => {
                      const scorePercentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                      let scoreClass = 'text-red-600';
                      if (scorePercentage >= 70) {
                        scoreClass = 'text-green-600';
                      } else if (scorePercentage >= 40) {
                        scoreClass = 'text-yellow-600';
                      }
                      
                      return (
                        <tr key={attempt.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.quizTitle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {attempt.score} / {attempt.totalQuestions}
                              <span className={`ml-2 text-xs font-medium ${scoreClass}`}>
                                ({scorePercentage}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatTime(attempt.timeTaken)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(attempt.completedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => navigate(`/quiz/${attempt.quizId}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Retake Quiz
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 