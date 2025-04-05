import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, getCategories } from '../../services/blogService';
import { getCourses } from '../../services/courseService';
import { BlogPost, Category } from '../../types/blog';
import { Course } from '../../types/course';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User, Clock, Award, Users, GraduationCap } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

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
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    totalUsers: 0,
    averageTime: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData, coursesData] = await Promise.all([
          getBlogPosts(),
          getCategories(),
          getCourses()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        setLoading(true);
        
        // Get recent quiz attempts
        const attemptsQuery = query(
          collection(db, 'quizAttempts'),
          orderBy('completedAt', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(attemptsQuery);
        const attempts: QuizAttempt[] = [];
        let totalScore = 0;
        let totalTime = 0;
        const uniqueUsers = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          attempts.push({
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail || 'Unknown',
            userDisplayName: data.userDisplayName || 'Unknown User',
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            score: data.score,
            totalQuestions: data.totalQuestions,
            timeTaken: data.timeTaken,
            completedAt: data.completedAt.toDate()
          });
          
          totalScore += (data.score / data.totalQuestions) * 100;
          totalTime += data.timeTaken;
          uniqueUsers.add(data.userId);
        });
        
        setRecentAttempts(attempts);
        
        // Calculate stats
        setStats({
          totalAttempts: attempts.length,
          averageScore: attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0,
          totalUsers: uniqueUsers.size,
          averageTime: attempts.length > 0 ? Math.round(totalTime / attempts.length) : 0
        });
      } catch (err) {
        console.error('Error fetching quiz attempts:', err);
        setError('Failed to load quiz attempts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAttempts();
  }, []);

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

  const statCards: StatCard[] = [
    {
      title: 'Total Attempts',
      value: stats.totalAttempts,
      icon: <Award className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: <Award className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Unique Users',
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Average Time',
      value: formatTime(stats.averageTime),
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return <LoadingScreen />;
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
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Posts Overview Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{posts.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/posts" className="font-medium text-blue-600 hover:text-blue-500">
                View all posts
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Overview Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{categories.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/categories" className="font-medium text-blue-600 hover:text-blue-500">
                Manage categories
              </Link>
            </div>
          </div>
        </div>

        {/* Courses Overview Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Courses</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{courses.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/courses" className="font-medium text-blue-600 hover:text-blue-500">
                Manage courses
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
              >
                Create New Post
              </Link>
              <Link
                to="/admin/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 w-full justify-center"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Create New Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Quiz Attempts */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Quiz Attempts
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            A list of the most recent quiz attempts by users
          </p>
        </div>
        
        {recentAttempts.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No quiz attempts recorded yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentAttempts.map((attempt) => (
              <li key={attempt.id}>
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
                        {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="mr-1 font-medium">Quiz:</span> {attempt.quizTitle}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>
                        Completed {formatDate(attempt.completedAt)} • Time: {formatTime(attempt.timeTaken)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
