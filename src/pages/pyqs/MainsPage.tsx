import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen, ChevronRight, AlertCircle } from 'lucide-react';

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

interface MainsPageProps {
  examType?: string;
}

interface MainsQuestion {
  id?: string;
  question: string;
  answer: string;
  tags: string[];
  category: string;
  paperId: string;
  paperTitle: string;
  paperYear: number;
  chapterId: string;
  chapterTitle: string;
  examType: string;
}

const MainsPage: React.FC<MainsPageProps> = ({ examType: examTypeProp }) => {
  // Get examType from props or URL params
  const { examType: examTypeParam = 'upsc' } = useParams<{ examType?: string }>();
  const examType = examTypeProp || examTypeParam;
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [mainsQuestions, setMainsQuestions] = useState<MainsQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  // Fetch papers for the selected exam type
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'pyqPapers'),
          where('examType', '==', examType),
          where('paperType', '==', 'mains')
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

  // Fetch questions when a chapter is selected
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedPaper || !selectedChapter) return;
      
      try {
        setLoading(true);
        const q = query(
          collection(db, 'mainsPYQs'),
          where('paperId', '==', selectedPaper.id),
          where('chapterId', '==', selectedChapter.id)
        );
        
        const querySnapshot = await getDocs(q);
        const questionsData: MainsQuestion[] = [];
        
        querySnapshot.forEach((doc) => {
          questionsData.push({ id: doc.id, ...doc.data() } as MainsQuestion);
        });
        
        setMainsQuestions(questionsData);
        setShowAnswer({});
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedPaper, selectedChapter]);

  const handlePaperSelect = (paper: Paper) => {
    setSelectedPaper(paper);
    setSelectedChapter(null);
    setMainsQuestions([]);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const toggleAnswer = (questionId: string | undefined) => {
    if (!questionId) return;
    
    setShowAnswer(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {examType.toUpperCase()} Mains PYQs
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Practice with previous year questions for {examType.toUpperCase()} Mains
          </p>
        </div>

        <div className="mt-12">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {loading && !papers.length ? (
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded md:col-span-3"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left sidebar - Papers */}
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
                                    {mainsQuestions.filter(q => q.chapterId === chapter.id).length} questions
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

              {/* Main content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedPaper && selectedChapter 
                        ? `${selectedPaper.title} - ${selectedChapter.title}` 
                        : 'Select a Chapter'}
                    </h3>
                    {selectedChapter && mainsQuestions.length > 0 && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {mainsQuestions.length} questions
                      </span>
                    )}
                  </div>
                  
                  <div className="px-4 py-5 sm:p-6">
                    {selectedPaper && selectedChapter ? (
                      mainsQuestions.length > 0 ? (
                        <div className="space-y-8">
                          {mainsQuestions.map((question, index) => (
                            <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                              <h3 className="text-lg font-semibold mb-4">
                                Q.{index + 1}
                              </h3>
                              <div 
                                className="text-gray-700 mb-4"
                                dangerouslySetInnerHTML={{ __html: question.question }}
                              />
                              
                              {question.category && question.category !== 'general' && (
                                <div className="mb-4">
                                  <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
                                    {question.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                </div>
                              )}
                              
                              {!showAnswer[question.id || ''] ? (
                                <button
                                  onClick={() => toggleAnswer(question.id)}
                                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Show Answer
                                </button>
                              ) : (
                                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                                  <h4 className="text-md font-medium mb-2 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1 text-indigo-600" />
                                    Answer:
                                  </h4>
                                  <div className="prose prose-sm max-w-none">
                                    <p className="whitespace-pre-line">{question.answer}</p>
                                  </div>
                                  <button
                                    onClick={() => toggleAnswer(question.id)}
                                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-500"
                                  >
                                    Hide Answer
                                  </button>
                                </div>
                              )}
                              
                              {question.tags && question.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-1">
                                  {question.tags.map(tag => (
                                    <span key={tag} className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No questions available</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            There are no questions available for this chapter yet.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {selectedPaper ? 'Select a chapter to begin' : 'Select a paper to begin'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedPaper 
                            ? 'Choose a chapter from the list to view questions and answers.'
                            : 'Select a previous year paper to view available chapters.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainsPage;
