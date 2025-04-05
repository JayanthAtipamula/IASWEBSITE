import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, ArrowRight } from 'lucide-react';
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
          Stay updated with the latest current affairs and developments.
        </p>
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