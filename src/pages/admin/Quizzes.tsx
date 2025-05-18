import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import { getQuizzes, deleteQuiz, Quiz } from '../../services/quizService';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete quiz. Please try again later.');
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <Link
          to="/admin/quizzes/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No quizzes found. Create your first quiz!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time (min)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Board
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                    <div className="text-sm text-gray-500">{quiz.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.totalQuestions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quiz.timeInMinutes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {quiz.quizType === 'mainsPyqs' ? 'Mains PYQs' : 
                       quiz.quizType === 'prelimsPractice' ? 'Prelims Practice' : 
                       quiz.quizType === 'mainsPractice' ? 'Mains Practice' : quiz.quizType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {quiz.examBoard?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {deleteConfirm === quiz.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteConfirm(quiz.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={handleDeleteCancel}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/quizzes/edit/${quiz.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(quiz.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Quizzes; 