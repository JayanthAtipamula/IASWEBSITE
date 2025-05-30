import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  order: number;
}

interface Paper {
  id: string;
  title: string;
  year: number;
  examType: string;
  paperType: string;
  chapters: Chapter[];
}

interface MCQuestion {
  id?: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  paperId: string;
  paperTitle: string;
  paperYear: number;
  chapterId: string;
  chapterTitle: string;
  examType: string;
}

const PrelimsPage: React.FC = () => {
  const { examType = 'upsc', paperId } = useParams<{ examType?: string; paperId?: string }>();
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [mcQuestions, setMcQuestions] = useState<MCQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Fetch the selected paper
  useEffect(() => {
    const fetchPaper = async () => {
      if (!paperId) return;
      
      try {
        setLoading(true);
        const paperDoc = await getDoc(doc(db, 'pyqPapers', paperId));
        
        if (paperDoc.exists()) {
          const data = paperDoc.data();
          setSelectedPaper({
            id: paperDoc.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || []
          });
        } else {
          setError('Paper not found');
        }
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  // Fetch quizzes when a chapter is selected
  useEffect(() => {
    const fetchMCQuestions = async () => {
      if (!selectedPaper || !selectedChapter) return;
      
      try {
        setLoading(true);
        const q = query(
          collection(db, 'prelimsMCQs'),
          where('paperId', '==', selectedPaper.id),
          where('chapterId', '==', selectedChapter.id)
        );
        
        const querySnapshot = await getDocs(q);
        const mcqData: MCQuestion[] = [];
        
        querySnapshot.forEach((doc) => {
          mcqData.push({ id: doc.id, ...doc.data() } as MCQuestion);
        });
        
        setMcQuestions(mcqData);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
        
      } catch (err) {
        console.error('Error fetching MCQs:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMCQuestions();
  }, [selectedPaper, selectedChapter]);

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return; // Prevent changing selection after submission
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null || mcQuestions.length === 0) return;
    // Check if selected option is correct
    setIsCorrect(selectedOption === mcQuestions[currentQuestionIndex].correctOption);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const examTitle = examType === 'upsc' ? 'UPSC' : 
                   examType === 'tgpsc' ? 'TGPSC' : 
                   examType === 'appsc' ? 'APPSC' : 'Prelims';

  if (loading && !selectedPaper) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 bg-white rounded-lg shadow p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPaper) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {selectedPaper.title} ({selectedPaper.year})
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <h4 className="text-base font-medium text-gray-900 mb-4">Chapters</h4>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                  {selectedPaper.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter)}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedChapter?.id === chapter.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      {chapter.title}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                {selectedChapter ? (
                  mcQuestions.length > 0 ? (
                    <div>
                      <div className="mb-6">
                        <h4 className="text-base font-medium text-gray-900">
                          Question {currentQuestionIndex + 1} of {mcQuestions.length}
                        </h4>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <p className="text-lg text-gray-900 mb-4">
                            {mcQuestions[currentQuestionIndex].question}
                          </p>
                          <div className="space-y-3">
                            {mcQuestions[currentQuestionIndex].options.map((option, index) => (
                              <div
                                key={index}
                                onClick={() => handleOptionSelect(index)}
                                className={`p-3 rounded-lg cursor-pointer border ${
                                  selectedOption === index
                                    ? showResult
                                      ? index === mcQuestions[currentQuestionIndex].correctOption
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-red-500 bg-red-50'
                                      : 'border-blue-500 bg-blue-50'
                                    : showResult && index === mcQuestions[currentQuestionIndex].correctOption
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center">
                                  {showResult && (
                                    <div className="mr-2">
                                      {index === mcQuestions[currentQuestionIndex].correctOption ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : selectedOption === index ? (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      ) : null}
                                    </div>
                                  )}
                                  <span className={`${
                                    showResult && index === mcQuestions[currentQuestionIndex].correctOption
                                      ? 'text-green-700'
                                      : showResult && selectedOption === index
                                      ? 'text-red-700'
                                      : 'text-gray-900'
                                  }`}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {showResult && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  {isCorrect ? (
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <h4 className={`text-sm font-medium ${
                                    isCorrect ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    {isCorrect ? 'Correct!' : 'Incorrect'}
                                  </h4>
                                  <p className="mt-2 text-sm text-gray-600">
                                    {mcQuestions[currentQuestionIndex].explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 rounded-md ${
                              currentQuestionIndex === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            Previous
                          </button>
                          {!showResult ? (
                            <button
                              onClick={handleSubmit}
                              disabled={selectedOption === null}
                              className={`px-4 py-2 rounded-md ${
                                selectedOption === null
                                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              Submit
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              disabled={currentQuestionIndex === mcQuestions.length - 1}
                              className={`px-4 py-2 rounded-md ${
                                currentQuestionIndex === mcQuestions.length - 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              Next
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        There are no questions available for this chapter yet.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No chapter selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a chapter from the list to view its questions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrelimsPage;
