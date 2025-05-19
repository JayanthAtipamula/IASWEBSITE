import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BlogPost } from '../types/blog';
import LoadingScreen from '../components/LoadingScreen';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const CurrentAffairsRawData: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        
        // Simpler query - just get all published posts
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('published', '==', true));
        const snapshot = await getDocs(q);
        
        const fetchedPosts = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as BlogPost));
        
        setAllPosts(fetchedPosts);
        
        // Filter for current affairs posts from all posts
        const currentAffairsPosts = fetchedPosts.filter(post => post.isCurrentAffair === true);
        setPosts(currentAffairsPosts);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'Unknown date';
    return format(new Date(timestamp), 'dd MMM yyyy');
  };

  if (loading) return <LoadingScreen />;
  
  if (error) {
    return (
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Current Affairs Raw Data</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Database Stats</h2>
        <ul className="list-disc ml-6">
          <li>Total Posts: {allPosts.length}</li>
          <li>Current Affairs Posts: {posts.length}</li>
        </ul>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Firebase Index Instructions</h2>
        <p className="mb-4">Your Firestore query requires a composite index. You need to create the following index in the Firebase console:</p>
        <div className="bg-white p-4 rounded border">
          <p>Collection: <strong>posts</strong></p>
          <p>Fields to index:</p>
          <ul className="list-disc ml-6">
            <li>published (Ascending)</li>
            <li>isCurrentAffair (Ascending)</li>
            <li>examType (Ascending)</li>
            <li>currentAffairDate (Descending)</li>
          </ul>
        </div>
        <p className="mt-4">To create this index:</p>
        <ol className="list-decimal ml-6">
          <li>Go to the Firebase Console</li>
          <li>Navigate to Firestore Database</li>
          <li>Click on "Indexes" tab</li>
          <li>Click "Create Index"</li>
          <li>Add the fields as listed above</li>
          <li>Click "Create"</li>
        </ol>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Current Affairs Posts ({posts.length})</h2>
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-800 p-4">
                <h2 className="text-xl font-bold text-white">{post.title}</h2>
                <p className="text-gray-300 text-sm mt-1">ID: {post.id}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Basic Info:</h3>
                    <ul className="text-sm text-gray-600 ml-4">
                      <li><span className="font-medium">Slug:</span> {post.slug}</li>
                      <li><span className="font-medium">Published:</span> {post.published ? 'Yes' : 'No'}</li>
                      <li><span className="font-medium">Author:</span> {post.author}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Current Affairs Info:</h3>
                    <ul className="text-sm text-gray-600 ml-4">
                      <li><span className="font-medium">Is Current Affair:</span> {post.isCurrentAffair ? 'Yes' : 'No'}</li>
                      <li><span className="font-medium">Exam Type:</span> {post.examType || 'Not set'}</li>
                      <li>
                        <span className="font-medium">Current Affair Date:</span> {
                          post.currentAffairDate 
                          ? `${post.currentAffairDate} (${formatDate(post.currentAffairDate)})` 
                          : 'Not set'
                        }
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Links:</h3>
                  <div className="space-y-2">
                    <div>
                      <Link 
                        to={`/notes/${post.slug}`} 
                        className="text-blue-600 hover:underline"
                      >
                        Notes Link: /notes/{post.slug}
                      </Link>
                    </div>
                    {post.examType && post.currentAffairDate && (
                      <div>
                        <Link 
                          to={`/current-affairs/${post.examType}/${post.currentAffairDate}/${post.slug}`}
                          className="text-green-600 hover:underline"
                        >
                          Current Affairs Link: /current-affairs/{post.examType}/{post.currentAffairDate}/{post.slug}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-center text-gray-700">No current affairs posts found in your database.</p>
        </div>
      )}
    </div>
  );
};

export default CurrentAffairsRawData;
