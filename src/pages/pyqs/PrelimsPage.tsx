import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  const { examType = 'upsc' } = useParams<{ examType?: string }>();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [mcQuestions, setMcQuestions] = useState<MCQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Fetch papers for the selected exam type
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'pyqPapers'),
          where('examType', '==', examType),
          where('paperType', '==', 'prelims')
        );
        
        const querySnapshot = await getDocs(q);
        const papersData: Paper[] = [];
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          papersData.push({
            id: doc.id,
            title: data.title,
            year: data.year,
            examType: data.examType,
            paperType: data.paperType,
            chapters: data.chapters || []
          });
        }
        
        // Sort papers by year in descending order
        papersData.sort((a, b) => b.year - a.year);
        setPapers(papersData);
        
        // Select the first paper by default if available
        if (papersData.length > 0) {
          setSelectedPaper(papersData[0]);
        }
        
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError('Failed to load papers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [examType]);

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

  const handlePaperSelect = (paper: Paper) => {
    setSelectedPaper(paper);
    setSelectedChapter(null);
  };

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

  if (loading && papers.length === 0) {
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
                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {examTitle} Prelims PYQs
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Practice with previous year questions for {examTitle} Prelims
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Papers and Chapters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Papers List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Previous Year Papers
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                {papers.map((paper) => (
                  <div 
                    key={paper.id}
                    onClick={() => handlePaperSelect(paper)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${selectedPaper?.id === paper.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{paper.title}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{paper.year}</p>
                    
                    {/* Show chapters under the selected paper */}
                    {selectedPaper?.id === paper.id && paper.chapters && paper.chapters.length > 0 && (
                      <div className="mt-2 pl-2 border-l-2 border-gray-200">
                        <h4 className="text-xs font-medium text-gray-500 mb-1">Chapters:</h4>
                        <div className="space-y-1">
                          {paper.chapters.map((chapter) => (
                            <div 
                              key={chapter.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChapterSelect(chapter);
                              }}
                              className={`px-2 py-1.5 text-xs rounded cursor-pointer hover:bg-gray-100 ${selectedChapter?.id === chapter.id ? 'bg-blue-100' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{chapter.title}</span>
                                <BookOpen className="h-3 w-3 text-gray-400" />
                              </div>
                              <p className="text-xs text-gray-500">
                                {mcQuestions.filter(q => q.chapterId === chapter.id).length} questions
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content - Quiz */}
          <div className="lg:col-span-3">
            {selectedChapter ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedPaper?.title} - {selectedChapter.title}
                    </h3>
                    {mcQuestions.length > 0 && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Question {currentQuestionIndex + 1} of {mcQuestions.length}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  {mcQuestions.length > 0 ? (
                    <div>
                      <div className="mb-6">
                        <p className="text-lg mb-6">{mcQuestions[currentQuestionIndex]?.question || 'No question available'}</p>
                        
                        <div className="space-y-3 mb-6">
                          {mcQuestions[currentQuestionIndex]?.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionSelect(index)}
                              className={`w-full text-left p-3 rounded-md border ${selectedOption === index 
                                ? (showResult 
                                    ? (index === mcQuestions[currentQuestionIndex].correctOption 
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-red-500 bg-red-50')
                                    : 'border-blue-500 bg-blue-50') 
                                : 'border-gray-300 hover:bg-gray-50'}`}
                              disabled={showResult}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                              {showResult && index === mcQuestions[currentQuestionIndex].correctOption && (
                                <span className="ml-2 text-green-600 inline-flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Correct
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          {showResult && (
                            <div className="p-4 mb-6 rounded-md border border-gray-200 bg-gray-50">
                              <div className="flex items-center mb-2">
                                {isCorrect ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="font-medium text-green-700">Correct!</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                    <span className="font-medium text-red-700">Incorrect</span>
                                  </>
                                )}
                              </div>
                              <div className="mt-3">
                                <h3 className="font-medium flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1 text-blue-500" />
                                  Explanation:
                                </h3>
                                <p className="mt-1 text-gray-700">
                                  {mcQuestions[currentQuestionIndex]?.explanation || 'No explanation available'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                              currentQuestionIndex === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Previous
                          </button>
                          
                          {!showResult ? (
                            <button
                              onClick={handleSubmit}
                              disabled={selectedOption === null}
                              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                selectedOption === null 
                                  ? 'bg-blue-300 cursor-not-allowed' 
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              Submit Answer
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              disabled={currentQuestionIndex === mcQuestions.length - 1}
                              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                              {currentQuestionIndex === mcQuestions.length - 1 ? 'Finish' : 'Next Question'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No questions available</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        There are no questions available for this chapter yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {selectedPaper ? 'Select a Chapter' : 'Select a Paper'}
                  </h3>
                </div>
                <div className="px-4 py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {selectedPaper ? 'Select a chapter to begin' : 'Select a paper to begin'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedPaper 
                      ? 'Choose a chapter from the list to view and attempt questions.'
                      : 'Select a previous year paper to view available chapters and questions.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrelimsPage;
