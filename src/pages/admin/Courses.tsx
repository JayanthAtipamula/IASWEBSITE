import React, { useEffect, useState } from 'react';
import { getCourses, getSampleCourses, createCourse, updateCourse, deleteCourse, migrateCourseExamTypes } from '../../services/courseService';
import { Course } from '../../types/course';
import LoadingScreen from '../../components/LoadingScreen';
import { Edit, Trash2, Eye, Plus, Loader, Upload, Link as LinkIcon, FileText, Download } from 'lucide-react';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getProxiedImageUrl } from '../../utils/imageUtils';
import CourseImage from '../../components/CourseImage';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [scheduleName, setScheduleName] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    duration: '',
    examType: 'upsc',
    features: [''],
    paymentLink: '',
    scheduleUrl: '',
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Run migration only once
      if (!migrationCompleted) {
        try {
          await migrateCourseExamTypes();
          setMigrationCompleted(true);
          localStorage.setItem('coursesMigrationCompleted', 'true');
        } catch (error) {
          console.warn('Migration failed, continuing with fetch:', error);
        }
      }
      
      const data = await getCourses();
      if (data.length === 0) {
        console.log('No courses found in Firestore, using sample data');
        setCourses(getSampleCourses());
        setUsingSampleData(true);
      } else {
        console.log(`Found ${data.length} courses`);
        setCourses(data);
        setUsingSampleData(false);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(getSampleCourses());
      setUsingSampleData(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    // Check if migration was already completed
    const migrationDone = localStorage.getItem('coursesMigrationCompleted') === 'true';
    setMigrationCompleted(migrationDone);
    
    fetchCourses();

    // Add event listener to prevent unintended form submissions
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading || uploading) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      duration: '',
      examType: 'upsc',
      features: [''],
      paymentLink: '',
      scheduleUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
    setScheduleFile(null);
    setScheduleName('');
    setEditingCourse(null);
    setShowCreateModal(true);
  };

  // Helper function to check if an ID is numeric (sample data)
  const isNumericId = (id: string): boolean => {
    return /^\d+$/.test(id);
  };

  const handleOpenEditModal = (course: Course) => {
    // Prevent editing sample courses
    if (usingSampleData || isNumericId(course.id)) {
      alert(`Cannot edit sample course "${course.title}". This is demo data.\n\nTo edit courses:\n1. Set up your Firebase configuration properly\n2. Create new courses which will be saved to your database\n3. Then you can edit your real courses`);
      return;
    }

    setFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
      duration: course.duration,
      examType: course.examType || 'upsc',
      features: [...course.features],
      paymentLink: course.paymentLink || '',
      scheduleUrl: course.scheduleUrl || '',
    });
    setImageFile(null);
    setImagePreview(course.imageUrl);
    setScheduleFile(null);
    setScheduleName(course.scheduleUrl ? course.scheduleUrl.split('/').pop() || 'Course Schedule' : '');
    setEditingCourse(course);
    setShowCreateModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      console.log('Uploading image:', file.name);
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `course-images/${Date.now()}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded image successfully');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Image download URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadSchedulePDF = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      console.log('Uploading schedule PDF:', file.name);
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `course-schedules/${Date.now()}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded schedule PDF successfully');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Schedule PDF download URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading schedule PDF:', error);
      throw error;
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setScheduleFile(file);
      setScheduleName(file.name);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({ ...formData, price: value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features!];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features!, ''] });
  };

  const removeFeatureField = (index: number) => {
    if (formData.features!.length <= 1) return;
    const updatedFeatures = formData.features!.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleFormSubmission = async (formData: Partial<Course>, isEditing: boolean): Promise<boolean> => {
    try {
      console.log('handleFormSubmission called with:', { formData, isEditing });
      
      const courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title!,
        description: formData.description!,
        imageUrl: formData.imageUrl!,
        price: formData.price!,
        duration: formData.duration!,
        examType: formData.examType!,
        features: formData.features!,
        paymentLink: formData.paymentLink,
        scheduleUrl: formData.scheduleUrl,
      };

      console.log('Prepared courseData:', courseData);

      if (isEditing && editingCourse) {
        console.log('Updating existing course:', editingCourse.id);
        await updateCourse(editingCourse.id, courseData);
        console.log('Course updated successfully');
      } else {
        console.log('Creating new course...');
        const newCourse = await createCourse(courseData);
        console.log('Course created successfully:', newCourse);
      }

      // Refresh the courses list
      console.log('Refreshing courses list...');
      await fetchCourses();
      console.log('Courses list refreshed');
      
      console.log(`Course ${isEditing ? 'updated' : 'created'} successfully`);
      return true;
    } catch (error) {
      console.error('Error in handleFormSubmission - Full details:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Log the exact courseData that failed
      console.error('Failed courseData:', {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        price: formData.price,
        duration: formData.duration,
        examType: formData.examType,
        features: formData.features,
        paymentLink: formData.paymentLink,
        scheduleUrl: formData.scheduleUrl,
      });
      
      throw error;
    }
  };

  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.title?.trim()) {
      alert('Please enter a course title');
      return false;
    }
    
    if (!formData.description?.trim()) {
      alert('Please enter a course description');
      return false;
    }
    
    if (!imageFile && !formData.imageUrl?.trim()) {
      alert('Please upload an image or provide an image URL');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted, preventing default');
    
    if (loading || uploading) {
      console.log('Already processing, ignoring submission');
      return;
    }
    
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      console.log('Processing course submission...');
      
      // If there's a new image file, upload it first
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        try {
          console.log('Uploading new image file...');
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setLoading(false);
          return;
        }
      }

      // If there's a new schedule file, upload it first
      let scheduleUrl = formData.scheduleUrl;
      if (scheduleFile) {
        try {
          console.log('Uploading new schedule PDF file...');
          scheduleUrl = await uploadSchedulePDF(scheduleFile);
        } catch (error) {
          console.error('Failed to upload schedule PDF:', error);
          alert(`Failed to upload schedule PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setLoading(false);
          return;
        }
      }
      
      // Validate required fields
      if (!formData.title || !formData.description || (!imageUrl && !formData.imageUrl)) {
        console.warn('Validation failed - missing required fields');
        alert('Please fill in all required fields: Title, Description, and Image');
        setLoading(false);
        return;
      }
      
      const updatedFormData = {
        ...formData,
        imageUrl: imageUrl || formData.imageUrl,
        scheduleUrl: scheduleUrl || formData.scheduleUrl,
        examType: formData.examType || 'upsc',
      };
      
      console.log('Prepared form data:', updatedFormData);
      
      // Process the form submission
      const success = await handleFormSubmission(updatedFormData, !!editingCourse);
      
      if (success) {
        alert(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
        setShowCreateModal(false);
      } else {
        // Try with local state as a fallback
        if (!editingCourse) {
          const newCourse = {
            ...updatedFormData,
            id: `temp-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          } as Course;
          
          setCourses([newCourse, ...courses]);
          alert('Course created in local state only. Database connection failed.');
          setShowCreateModal(false);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting course - Full error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        alert(`Detailed error: ${error.message}`);
      } else {
        console.error('Non-Error object thrown:', error);
        alert(`An error occurred while saving the course: ${JSON.stringify(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Prevent deleting sample courses
    if (usingSampleData || isNumericId(id)) {
      const course = courses.find(c => c.id === id);
      alert(`Cannot delete sample course "${course?.title || 'Unknown'}". This is demo data.\n\nTo delete courses:\n1. Set up your Firebase configuration properly\n2. Create new courses which will be saved to your database\n3. Then you can delete your real courses`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    
    try {
      setDeletingCourseId(id);
      // Delete from Firestore
      await deleteCourse(id);
      // Update local state
      setCourses(courses.filter(course => course.id !== id));
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      // Still remove from local state if Firestore fails
      setCourses(courses.filter(course => course.id !== id));
      alert('Course removed from view, but database removal may have failed.');
    } finally {
      setDeletingCourseId(null);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      {usingSampleData && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Demo Mode:</strong> You're viewing sample courses because no real courses were found in your database. 
                You cannot edit or delete these sample courses. Create new courses to start managing your real course data.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Course Management</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <p className="text-gray-500">No courses available. Create your first course!</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
              <li key={course.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden">
                      <CourseImage 
                        imagePath={course.imageUrl}
                        alt={course.title} 
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-blue-600">{course.title}</h3>
                        {(usingSampleData || isNumericId(course.id)) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Demo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col mr-4">
                      <div className="text-lg font-semibold text-gray-900">{formatPrice(course.price)}</div>
                      {course.scheduleUrl && (
                        <a 
                          href={course.scheduleUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Schedule
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      className={`p-2 ${usingSampleData || isNumericId(course.id) 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-800'
                      }`}
                      title={usingSampleData || isNumericId(course.id) 
                        ? 'Cannot edit demo course' 
                        : 'Edit course'
                      }
                      disabled={deletingCourseId === course.id || usingSampleData || isNumericId(course.id)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className={`p-2 disabled:opacity-50 ${
                        usingSampleData || isNumericId(course.id)
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-800'
                      }`}
                      title={usingSampleData || isNumericId(course.id) 
                        ? 'Cannot delete demo course' 
                        : 'Delete course'
                      }
                      disabled={deletingCourseId === course.id || usingSampleData || isNumericId(course.id)}
                    >
                      {deletingCourseId === course.id ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                    <a
                      href="/courses"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-800"
                      title="View courses page"
                    >
                      <Eye className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create/Edit Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
            </div>
            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              className="p-6 space-y-4"
              noValidate
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-300">
                    {imagePreview ? (
                      <CourseImage
                        imagePath={imagePreview}
                        alt="Course preview"
                        className="h-24 w-24 object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 flex items-center justify-center text-gray-400">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative border border-gray-300 rounded-md shadow-sm py-2 px-3 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <label htmlFor="imageUpload" className="cursor-pointer flex items-center text-blue-600 hover:text-blue-500">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>{uploading ? 'Uploading...' : 'Upload image'}</span>
                        <input
                          id="imageUpload"
                          name="imageUpload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or GIF, 800x600 recommended
                    </p>
                    {!imageFile && (
                      <div className="mt-2">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                          Or enter image URL:
                        </label>
                        <input
                          type="url"
                          name="imageUrl"
                          id="imageUrl"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          required={!imageFile}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.price}
                    onChange={handlePriceChange}
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (e.g., "3 months")
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="examType" className="block text-sm font-medium text-gray-700">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="examType"
                  id="examType"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.examType}
                  onChange={handleInputChange}
                >
                  <option value="upsc">UPSC</option>
                  <option value="tgpsc">TGPSC</option>
                  <option value="appsc">APPSC</option>
                  <option value="all">All Exams</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select the exam type this course is designed for
                </p>
              </div>

              <div>
                <label htmlFor="paymentLink" className="block text-sm font-medium text-gray-700">
                  Payment Link
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <LinkIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    name="paymentLink"
                    id="paymentLink"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://payment.gateway.com/your-link"
                    value={formData.paymentLink}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter a payment gateway link where students can pay for this course
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Schedule PDF
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="relative border border-gray-300 rounded-md shadow-sm py-2 px-3 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <label htmlFor="scheduleUpload" className="cursor-pointer flex items-center text-blue-600 hover:text-blue-500">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>{uploading ? 'Uploading...' : 'Upload schedule PDF'}</span>
                        <input
                          id="scheduleUpload"
                          name="scheduleUpload"
                          type="file"
                          accept="application/pdf"
                          className="sr-only"
                          onChange={handleScheduleChange}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {scheduleName && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        <span className="truncate">{scheduleName}</span>
                      </div>
                    )}
                    {!scheduleFile && (
                      <div className="mt-2">
                        <label htmlFor="scheduleUrl" className="block text-sm font-medium text-gray-700">
                          Or enter schedule PDF URL:
                        </label>
                        <input
                          type="url"
                          name="scheduleUrl"
                          id="scheduleUrl"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.scheduleUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/course-schedule.pdf"
                        />
                      </div>
                    )}
                    {formData.scheduleUrl && !scheduleFile && (
                      <div className="mt-2">
                        <a 
                          href={formData.scheduleUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          View current schedule
                        </a>
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Upload a PDF file with the course schedule that students can download
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                {formData.features!.map((feature, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter a feature"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                      title="Remove feature"
                      disabled={formData.features!.length <= 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeatureField}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Feature
                </button>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading || uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center min-w-[120px]"
                  disabled={loading || uploading}
                  onClick={(e) => {
                    // Extra check to prevent default form submission
                    console.log('Submit button clicked');
                    if (loading || uploading) {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Already loading, preventing submission');
                      return;
                    }
                  }}
                >
                  {(loading || uploading) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {uploading ? 'Uploading...' : editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingCourse ? 'Update Course' : 'Create Course'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses; 