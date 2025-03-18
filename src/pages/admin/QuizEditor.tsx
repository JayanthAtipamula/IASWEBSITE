import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import QuizForm from '../../components/admin/QuizForm';
import { getQuizById, createQuiz, updateQuiz, Quiz } from '../../services/quizService';

const QuizEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!id;

  // Fetch quiz data if editing
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;

      try {
        setFetchLoading(true);
        const quizData = await getQuizById(id);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        setQuiz(quizData);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSubmit = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        // Update existing quiz
        await updateQuiz(id, quizData);
      } else {
        // Create new quiz
        await createQuiz(quizData);
      }

      navigate('/admin/quizzes');
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('Failed to save quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        <div className="flex">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/admin/quizzes')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
      </h1>
      
      <QuizForm
        initialData={quiz || undefined}
        onSubmit={handleSubmit}
        isLoading={loading}
        isEditing={isEditing}
      />
    </div>
  );
};

export default QuizEditor; 