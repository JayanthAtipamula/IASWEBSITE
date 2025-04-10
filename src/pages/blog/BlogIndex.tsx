import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublishedPosts, getCategories } from '../../services/blogService';
import { BlogPost, Category } from '../../types/blog';
import LoadingScreen from '../../components/LoadingScreen';

// Map of exam types to their display names
const EXAM_TYPES: Record<string, string> = {
  'upsc-notes': 'UPSC',
  'appsc-notes': 'APPSC',
  'tgpsc-notes': 'TGPSC',
  'notes': 'All'
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Determine which exam type we're displaying based on the URL path
  const currentPath = location.pathname.split('/')[1]; // Get the first segment after /
  const examType = EXAM_TYPES[currentPath] || 'All';
  
  // Function to filter categories based on exam type
  const filterCategoriesByExamType = (categories: Category[], examType: string) => {
    // Temporarily show all categories for all exam types
    return categories;
    
    /* TODO: Implement proper filtering once you have an examType field in your categories
    if (examType === 'All') return categories;
    
    return categories.filter(category => {
      if (examType === 'UPSC') {
        return category.name.includes('UPSC') || 
               category.name.includes('Civil Services') || 
               category.name.includes('IAS');
      } else if (examType === 'APPSC') {
        return category.name.includes('APPSC') || 
               category.name.includes('Andhra');
      } else if (examType === 'TGPSC') {
        return category.name.includes('TGPSC') || 
               category.name.includes('Telangana');
      }
      return true;
    });
    */
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPublishedPosts(),
          getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchData();
  }, []);

  // Function to get posts for a specific category
  const getPostsByCategory = (categoryId: string) => {
    return posts.filter(post => post.categories.includes(categoryId));
  };

  // Function to get random number of posts between 10-15 or all if less
  const getRandomPostsForCategory = (categoryId: string) => {
    const categoryPosts = getPostsByCategory(categoryId);
    const maxPosts = Math.min(categoryPosts.length, Math.floor(Math.random() * 6) + 10); // Random between 10-15
    return categoryPosts.slice(0, maxPosts);
  };

  if (loading) {
    return <LoadingScreen />;
  }
  
  // Filter categories based on exam type
  const filteredCategories = filterCategoriesByExamType(categories, examType);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {examType === 'All' ? 'Notes' : `${examType} Notes`}
      </h1>
      
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-600">No categories found for {examType}</h2>
          <p className="mt-4">Please create categories specific to {examType} in the admin panel.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredCategories.map((category) => {
            const categoryPosts = getPostsByCategory(category.id);
            const displayPosts = getRandomPostsForCategory(category.id);
            
            return (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 break-inside-avoid-column hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4 flex items-center">
                  <div className="mr-2 text-blue-500 text-2xl font-bold">{categoryPosts.length}</div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                </div>
                
                <div className="p-5">
                  <ul className="space-y-1 mb-6">
                    {displayPosts.map((post) => (
                      <li key={post.id} className="py-1">
                        <Link 
                          to={`/notes/${post.slug}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-start"
                        >
                          <span className="text-xs text-gray-500 mr-2 mt-1">•</span>
                          <span>{post.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-full px-6 py-2 inline-flex items-center justify-center text-sm font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow"
                  >
                    Explore More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogIndex;
