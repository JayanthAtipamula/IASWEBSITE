import React, { useState, useEffect } from 'react';
import { getCourses, getSampleCourses } from '../services/courseService';
import { Course } from '../types/course';
import { BookOpen, Clock, Check } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Try to fetch courses from Firestore
        const coursesData = await getCourses();
        
        // If no courses in Firestore, use sample data
        if (coursesData.length === 0) {
          setCourses(getSampleCourses());
        } else {
          setCourses(coursesData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        // Fallback to sample data in case of error
        setCourses(getSampleCourses());
        setError('Using sample data due to connection issues.');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchCourses();
  }, []);

  // Format price to Indian Rupee format
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive courses designed to help you succeed in your UPSC and other competitive examinations journey.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
              
              <p className="text-gray-600 mb-4 flex-grow">{course.description}</p>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">What you'll learn:</h3>
                <ul className="space-y-1">
                  {course.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {course.features.length > 3 && (
                    <li className="text-sm text-blue-600 ml-6">+{course.features.length - 3} more features</li>
                  )}
                </ul>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(course.price)}</div>
                {course.paymentLink ? (
                  <a
                    href={course.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Buy Now
                  </a>
                ) : (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full inline-flex items-center transition-colors duration-300"
                    onClick={() => window.alert(`Enrollment for ${course.title} will be available soon!`)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage; 