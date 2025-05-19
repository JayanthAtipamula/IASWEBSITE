import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getCurrentAffairsByExam } from '../services/currentAffairsService';
import { BlogPost } from '../types/blog';
import LoadingScreen from '../components/LoadingScreen';

const CurrentAffairsDebug: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [upscPosts, setUpscPosts] = useState<BlogPost[]>([]);
  const [tgpscPosts, setTgpscPosts] = useState<BlogPost[]>([]);
  const [appscPosts, setAppscPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [upscData, tgpscData, appscData] = await Promise.all([
          getCurrentAffairsByExam('upsc'),
          getCurrentAffairsByExam('tgpsc'),
          getCurrentAffairsByExam('appsc')
        ]);
        setUpscPosts(upscData);
        setTgpscPosts(tgpscData);
        setAppscPosts(appscData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'Unknown date';
    return format(new Date(timestamp), 'dd MMM yyyy');
  };

  if (loading) return <LoadingScreen />;

  const renderPost = (post: BlogPost) => (
    <div key={post.id} className="border p-4 rounded-lg mb-4 bg-white shadow-sm">
      <h3 className="font-bold text-lg">{post.title}</h3>
      <div className="text-sm text-gray-500 my-1">
        Date: {formatDate(post.currentAffairDate)} | Type: {post.examType}
      </div>
      
      <div className="mt-2">
        <div className="mb-1"><strong>isCurrentAffair:</strong> {post.isCurrentAffair ? 'Yes' : 'No'}</div>
        {post.currentAffairDate && (
          <div className="mb-1"><strong>currentAffairDate:</strong> {post.currentAffairDate} ({formatDate(post.currentAffairDate)})</div>
        )}
        <div className="mb-1"><strong>Slug:</strong> {post.slug}</div>
      </div>
      
      <div className="mt-3 flex flex-col space-y-2">
        <div className="font-semibold">Debug Links:</div>
        <div className="ml-4 flex flex-col space-y-1">
          <Link 
            to={`/notes/${post.slug}`} 
            className="text-blue-600 hover:underline"
          >
            /notes/{post.slug}
          </Link>
          {post.examType && post.currentAffairDate && (
            <Link 
              to={`/current-affairs/${post.examType}/${post.currentAffairDate}`} 
              className="text-green-600 hover:underline"
            >
              /current-affairs/{post.examType}/{post.currentAffairDate}
            </Link>
          )}
          {post.examType && post.currentAffairDate && (
            <Link 
              to={`/current-affairs/${post.examType}/${post.currentAffairDate}/${post.slug}`} 
              className="text-purple-600 hover:underline"
            >
              /current-affairs/{post.examType}/{post.currentAffairDate}/{post.slug}
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Current Affairs Debug Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">UPSC Current Affairs ({upscPosts.length})</h2>
          {upscPosts.length > 0 ? (
            upscPosts.map(renderPost)
          ) : (
            <p className="text-gray-500">No UPSC current affairs found.</p>
          )}
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">TGPSC Current Affairs ({tgpscPosts.length})</h2>
          {tgpscPosts.length > 0 ? (
            tgpscPosts.map(renderPost)
          ) : (
            <p className="text-gray-500">No TGPSC current affairs found.</p>
          )}
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">APPSC Current Affairs ({appscPosts.length})</h2>
          {appscPosts.length > 0 ? (
            appscPosts.map(renderPost)
          ) : (
            <p className="text-gray-500">No APPSC current affairs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsDebug;
