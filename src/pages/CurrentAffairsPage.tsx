import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { getCurrentAffairsPosts } from '../services/blogService';
import LoadingScreen from '../components/LoadingScreen';

const CurrentAffairsPage: React.FC = () => {
  const [currentAffairs, setCurrentAffairs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentAffairs = async () => {
      try {
        setLoading(true);
        const posts = await getCurrentAffairsPosts();
        setCurrentAffairs(posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching current affairs:', err);
        setError('Failed to load current affairs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAffairs();
  }, []);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'Date not available';
    return format(new Date(timestamp), 'dd MMMM yyyy');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Current Affairs</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Stay updated with the latest current affairs and developments for competitive examinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* UPSC Current Affairs Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="bg-blue-600 p-4">
            <h2 className="text-xl font-bold text-white">UPSC Current Affairs</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Daily current affairs and news analysis for UPSC Civil Services Examination.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Daily Updates</span>
              </div>
              <Link 
                to="/current-affairs/upsc"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* TGPSC Current Affairs Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="bg-green-600 p-4">
            <h2 className="text-xl font-bold text-white">TGPSC Current Affairs</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Daily current affairs and news analysis for Telangana Public Service Commission.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Daily Updates</span>
              </div>
              <Link 
                to="/current-affairs/tgpsc"
                className="inline-flex items-center text-green-600 hover:text-green-800"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* APPSC Current Affairs Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="bg-purple-600 p-4">
            <h2 className="text-xl font-bold text-white">APPSC Current Affairs</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Daily current affairs and news analysis for Andhra Pradesh Public Service Commission.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Daily Updates</span>
              </div>
              <Link 
                to="/current-affairs/appsc"
                className="inline-flex items-center text-purple-600 hover:text-purple-800"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Why Current Affairs Matter</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Staying updated with current affairs is crucial for success in competitive examinations. Our daily compilations cover important national and international events, government policies, appointments, awards, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">Comprehensive Coverage</h3>
            <p className="text-sm text-gray-600">All important events and developments covered in detail</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">Exam-Focused</h3>
            <p className="text-sm text-gray-600">Content tailored specifically for each examination</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">Daily Updates</h3>
            <p className="text-sm text-gray-600">Fresh content added every day for continuous learning</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {currentAffairs.length === 0 && !loading && !error ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No current affairs available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Current Affairs</h2>
              
              <div className="space-y-4">
                {currentAffairs.map((post) => (
                  <Link 
                    to={`/notes/${post.slug}`} 
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-blue-600 font-medium mr-3">
                        {formatDate(post.currentAffairDate)}
                      </span>
                      <span className="text-gray-800">
                        CURRENT AFFAIRS
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentAffairsPage;