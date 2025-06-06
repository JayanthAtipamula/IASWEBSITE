import React, { useState } from 'react';
import { X, Plus, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Quiz, QuizQuestion, QuizType, ExamBoard } from '../../services/quizService';
import RichTextEditor from '../RichTextEditor';

interface QuizFormProps {
  initialData?: Partial<Quiz>;
  onSubmit: (data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  isEditing,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [timeInMinutes, setTimeInMinutes] = useState(initialData?.timeInMinutes || 15);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialData?.difficulty || 'medium');
  const [quizType, setQuizType] = useState<QuizType>(initialData?.quizType || 'prelimsPractice');
  const [examBoard, setExamBoard] = useState<ExamBoard>(initialData?.examBoard || 'upsc');
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>(
    initialData?.questions || [{ id: '', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update totalQuestions when questions array changes
  const totalQuestions = questions.length;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (timeInMinutes <= 0) {
      newErrors.timeInMinutes = 'Time must be greater than 0';
    }

    if (!examBoard) {
      newErrors.examBoard = 'Exam board is required';
    }

    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (!question.question?.trim()) {
        newErrors[`question_${index}`] = 'Question text is required';
      }

      question.options?.forEach((option, optionIndex) => {
        if (!option.trim()) {
          newErrors[`question_${index}_option_${optionIndex}`] = 'Option text is required';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: '', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const options = [...(newQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options };
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], correctAnswer: optionIndex };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      timeInMinutes,
      difficulty,
      quizType,
      examBoard,
      totalQuestions,
      questions: questions as QuizQuestion[],
    };

    await onSubmit(quizData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>
        <div className="flex space-x-2">
          <Link
            to="/admin/quizzes"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.title ? 'border-red-300' : ''
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.description ? 'border-red-300' : ''
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="timeInMinutes" className="block text-sm font-medium text-gray-700">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                id="timeInMinutes"
                value={timeInMinutes}
                onChange={(e) => setTimeInMinutes(parseInt(e.target.value))}
                min="1"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.timeInMinutes ? 'border-red-300' : ''
                }`}
              />
              {errors.timeInMinutes && <p className="mt-1 text-sm text-red-600">{errors.timeInMinutes}</p>}
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="quizType" className="block text-sm font-medium text-gray-700">
              Quiz Type
            </label>
            <select
              id="quizType"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value as QuizType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="prelimsPractice">Prelims Practice</option>
              <option value="mainsPractice">Mains Practice</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="examBoard" className="block text-sm font-medium text-gray-700">
              Exam Board
            </label>
            <select
              id="examBoard"
              value={examBoard}
              onChange={(e) => setExamBoard(e.target.value as ExamBoard)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.examBoard ? 'border-red-300' : ''
              }`}
            >
              <option value="upsc">UPSC</option>
              <option value="tgpsc">TGPSC</option>
              <option value="appsc">APPSC</option>
            </select>
            {errors.examBoard && <p className="mt-1 text-sm text-red-600">{errors.examBoard}</p>}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </button>
        </div>

        {errors.questions && <p className="mt-1 text-sm text-red-600 mb-4">{errors.questions}</p>}

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor={`question-${questionIndex}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Question Text
                </label>
                <input
                  type="text"
                  id={`question-${questionIndex}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors[`question_${questionIndex}`] ? 'border-red-300' : ''
                  }`}
                />
                {errors[`question_${questionIndex}`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`question_${questionIndex}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-3">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        id={`question-${questionIndex}-option-${optionIndex}-correct`}
                        name={`question-${questionIndex}-correct`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <input
                        type="text"
                        id={`question-${questionIndex}-option-${optionIndex}`}
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        className={`ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                          errors[`question_${questionIndex}_option_${optionIndex}`]
                            ? 'border-red-300'
                            : ''
                        }`}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Select the radio button next to the correct answer.
                </p>
              </div>

              <div>
                <label
                  htmlFor={`question-${questionIndex}-explanation`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Explanation (Optional)
                </label>
                <RichTextEditor
                  value={question.explanation || ''}
                  onChange={(value) => handleQuestionChange(questionIndex, 'explanation', value)}
                  placeholder="Enter explanation for this question..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default QuizForm; 