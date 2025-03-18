import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Award, Users, BookOpen } from 'lucide-react';

interface QuizStatsProps {
  userId?: string; // Optional: if provided, shows stats only for this user
}

const QuizStats: React.FC<QuizStatsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    uniqueUsers: 0,
    averageScore: 0,
    uniqueQuizzes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Create query without orderBy to avoid errors
        const attemptsRef = collection(db, 'quizAttempts');
        const q = userId 
          ? query(attemptsRef, where('userId', '==', userId))
          : query(attemptsRef);
        
        // Get data
        const snapshot = await getDocs(q);
        const attempts = snapshot.docs.map(doc => doc.data());
        
        // Calculate stats
        const uniqueUsers = new Set(attempts.map(a => a.userId).filter(Boolean)).size;
        const uniqueQuizzes = new Set(attempts.map(a => a.quizId).filter(Boolean)).size;
        
        let totalScore = 0;
        let validScores = 0;
        
        attempts.forEach(a => {
          if (a.score !== undefined && a.totalQuestions > 0) {
            totalScore += (a.score / a.totalQuestions) * 100;
            validScores++;
          }
        });
        
        setStats({
          totalAttempts: attempts.length,
          uniqueUsers,
          averageScore: validScores > 0 ? Math.round(totalScore / validScores) : 0,
          uniqueQuizzes
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load quiz statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 text-sm underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quiz Statistics
        </h3>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Total Attempts</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalAttempts}</p>
              </div>
            </div>
          </div>
          
          {!userId && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-500">Unique Users</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.uniqueUsers}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Unique Quizzes</p>
                <p className="text-lg font-semibold text-gray-900">{stats.uniqueQuizzes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Average Score</p>
                <p className="text-lg font-semibold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStats;
