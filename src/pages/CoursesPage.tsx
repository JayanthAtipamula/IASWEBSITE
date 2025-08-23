import React, { useState, useEffect } from 'react';
import { getCourses, getSampleCourses } from '../services/courseService';
import { Course } from '../types/course';
import { Clock, Check, FileText, ShoppingCart } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import { getProxiedImageUrl } from '../utils/imageUtils';
import CourseImage from '../components/CourseImage';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedExam, setSelectedExam] = useState<'all' | 'upsc' | 'tgpsc' | 'appsc'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize with sample data for immediate rendering
    setCourses(getSampleCourses());
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Try to fetch courses from Firestore
        const coursesData = await getCourses();
        
        // If courses found in Firestore, replace sample data
        if (coursesData.length > 0) {
          setCourses(coursesData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        // Fallback to sample data in case of error
        setCourses(getSampleCourses());
        setError('Using sample data due to connection issues.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch real courses after component mounts on client
    const timer = setTimeout(fetchCourses, 100);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Filter courses when courses or selectedExam changes
  useEffect(() => {
    if (selectedExam === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.examType === selectedExam || course.examType === 'all'
      );
      setFilteredCourses(filtered);
    }
  }, [courses, selectedExam]);

  const handleExamFilter = (exam: 'all' | 'upsc' | 'tgpsc' | 'appsc') => {
    setSelectedExam(exam);
  };

  // Format price to Indian Rupee format
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Don't show loading screen during SSR, only on client side
  if (loading && isClient) {
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

      {/* Exam Filter */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">
            Filter by Exam:
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExamFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedExam === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => handleExamFilter('upsc')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedExam === 'upsc'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              UPSC
            </button>
            <button
              onClick={() => handleExamFilter('tgpsc')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedExam === 'tgpsc'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              TGPSC
            </button>
            <button
              onClick={() => handleExamFilter('appsc')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedExam === 'appsc'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              APPSC
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 flex flex-col transform hover:-translate-y-1"
          >
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
              <CourseImage 
                imagePath={course.imageUrl} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Enhanced Exam Type Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-md ${
                  course.examType === 'upsc' ? 'bg-blue-500 text-white' :
                  course.examType === 'tgpsc' ? 'bg-emerald-500 text-white' :
                  course.examType === 'appsc' ? 'bg-purple-500 text-white' :
                  'bg-gray-700 text-white'
                }`}>
                  {course.examType.toUpperCase()}
                </span>
              </div>
              {/* Duration Badge */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              {/* Title with better typography */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                {course.title}
              </h2>
              
              {/* Description with better spacing */}
              <p className="text-gray-600 mb-5 flex-grow leading-relaxed text-sm">
                {course.description}
              </p>
              
              {/* Enhanced Features Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {course.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 mr-3 group-hover/item:bg-green-200 transition-colors">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                  {course.features.length > 3 && (
                    <li className="text-xs text-blue-600 ml-8 font-medium">
                      +{course.features.length - 3} more benefits
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Enhanced Footer Section */}
              <div className="mt-auto border-t border-gray-100 pt-4">
                {/* Price with better styling */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(course.price)}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    One-time payment
                  </div>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="flex gap-3">
                  {course.scheduleUrl ? (
                    <a
                      href={course.scheduleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 border border-gray-200 hover:border-gray-300 group/btn"
                    >
                      <FileText className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      <span className="font-medium text-sm">Schedule</span>
                    </a>
                  ) : (
                    <button
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 border border-gray-200 hover:border-gray-300 group/btn"
                      onClick={() => window.alert(`Schedule for ${course.title} will be available soon!`)}
                    >
                      <FileText className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      <span className="font-medium text-sm">Schedule</span>
                    </button>
                  )}
                  
                  {course.paymentLink ? (
                    <a
                      href={course.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      <span className="font-bold text-sm">Enroll Now</span>
                    </a>
                  ) : (
                    <button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                      onClick={() => window.alert(`Enrollment for ${course.title} will be available soon!`)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      <span className="font-bold text-sm">Enroll Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {selectedExam === 'all' 
              ? 'No courses available at the moment. Please check back later.'
              : `No courses available for ${selectedExam.toUpperCase()} at the moment.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage; 