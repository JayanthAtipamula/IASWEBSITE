import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { getCurrentAffairsByDate } from '../services/currentAffairsService';
import { ExamType } from '../services/currentAffairsService';
import LoadingScreen from './LoadingScreen';

interface CurrentAffairsDetailProps {
  examType: ExamType;
  title: string;
  color: string;
}

const CurrentAffairsDetail: React.FC<CurrentAffairsDetailProps> = ({ examType, title, color }) => {
  const { dateParam } = useParams<{ dateParam: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!dateParam) {
        setError('Invalid date parameter');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const date = parseInt(dateParam, 10);
        if (isNaN(date)) {
          setError('Invalid date format');
          return;
        }

        const result = await getCurrentAffairsByDate(date, examType);
        setPosts(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${examType} current affairs for date:`, err);
        setError(`Failed to load ${examType.toUpperCase()} current affairs. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [dateParam, examType]);

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd MMMM yyyy');
  };

  if (loading) return <LoadingScreen />;

  // Generate dynamic classes based on color prop
  const getTextColorClass = () => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const getBgColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      case 'purple': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  const date = dateParam ? parseInt(dateParam, 10) : 0;
  const formattedDate = !isNaN(date) ? formatDate(date) : 'Invalid Date';

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => navigate(`/current-affairs/${examType}`)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {title} Dates
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center">
          <Calendar className={`${getTextColorClass()} h-5 w-5 mr-2`} />
          <span className="text-lg font-medium">{formattedDate}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {posts.length === 0 && !loading && !error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No current affairs available for this date.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${getBgColorClass()} p-4`}>
                <h2 className="text-xl font-bold text-white">{post.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link 
                  to={`/current-affairs/${examType}/${post.currentAffairDate}/${post.slug}`}
                  className={`inline-flex items-center ${getTextColorClass()} hover:underline`}
                >
                  Read Full Article
                  <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairsDetail;
