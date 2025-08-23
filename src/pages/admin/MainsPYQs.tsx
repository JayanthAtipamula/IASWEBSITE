import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, addDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen, Edit, Trash, ChevronDown, ChevronUp, FilePlus, FolderPlus } from 'lucide-react';
import ClientOnlyClientOnlyRichTextEditor from '../../components/ClientOnlyClientOnlyRichTextEditor';

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

interface PaperWithQuestions extends Paper {
  questions?: MainsQuestion[];
}

const MainsPYQs: React.FC = () => {
  // For paper and chapter management
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: '',
    year: new Date().getFullYear(),
    examType: 'upsc',
    paperType: 'mains'
  });
  const [newChapter, setNewChapter] = useState({
    title: '',
    order: 1
  });

  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperWithQuestions | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<MainsQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPapers, setExpandedPapers] = useState<Record<string, boolean>>({});
  const [currentQuestion, setCurrentQuestion] = useState<MainsQuestion>({
    question: '',
    answer: '',
    tags: [],
    category: 'general',
    paperId: '',
    paperTitle: '',
    paperYear: 0,
    chapterId: '',
    chapterTitle: '',
    examType: 'upsc'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [examTypes] = useState(['upsc', 'tgpsc', 'appsc']);
  const [selectedExamType, setSelectedExamType] = useState('upsc');
  const [newTag, setNewTag] = useState('');
  
  // Display error message if needed
  const showError = error ? (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  ) : null;

  // Fetch papers for the selected exam type
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'pyqPapers'),
          where('examType', '==', selectedExamType),
          where('paperType', '==', 'mains')
        );
        
        const querySnapshot = await getDocs(q);
        const papersData: Paper[] = [];
        
        for (const docRef of querySnapshot.docs) {
          const data = docRef.data();
          papersData.push({
            id: docRef.id,
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
        
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError('Failed to load papers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [selectedExamType]);

  // Fetch questions when a chapter is selected
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedPaper || !selectedChapter) {
        setQuestions([]);
        return;
      }
      
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
          const data = doc.data();
          questionsData.push({
            id: doc.id,
            question: data.question,
            answer: data.answer,
            tags: data.tags || [],
            category: data.category || 'general',
            paperId: data.paperId,
            paperTitle: data.paperTitle,
            paperYear: data.paperYear,
            chapterId: data.chapterId,
            chapterTitle: data.chapterTitle,
            examType: data.examType
          });
        });
        
        setQuestions(questionsData);
        
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedPaper, selectedChapter]);

  const handlePaperSelect = async (paper: Paper) => {
    // Toggle expanded state
    setExpandedPapers((prev) => ({
      ...prev,
      [paper.id]: !prev[paper.id]
    }));

    setSelectedPaper(paper);
    setSelectedChapter(null);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    resetForm();
  };

  const resetForm = () => {
    setCurrentQuestion({
      question: '',
      answer: '',
      tags: [],
      category: 'general',
      paperId: '',
      paperTitle: '',
      paperYear: 0,
      chapterId: '',
      chapterTitle: '',
      examType: 'upsc'
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // Paper management functions
  const handleAddPaper = async () => {
    if (!newPaper.title || newPaper.year <= 0) {
      setError('Please provide a valid paper title and year');
      return;
    }

    try {
      setLoading(true);
      // Add new paper to Firestore
      const paperData = {
        title: newPaper.title,
        year: newPaper.year,
        examType: selectedExamType,
        paperType: 'mains',
        chapters: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'pyqPapers'), paperData);
      
      // Add the new paper to the array
      const newPaperWithId = {
        id: docRef.id,
        ...paperData,
        chapters: []
      };
      setPapers(prev => [...prev, newPaperWithId]);
      
      // Reset form
      setNewPaper({
        title: '',
        year: new Date().getFullYear(),
        examType: selectedExamType,
        paperType: 'mains'
      });
      setShowPaperForm(false);
      
    } catch (err) {
      console.error('Error adding paper:', err);
      setError('Failed to add paper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (!selectedPaper || !newChapter.title) {
      setError('Please select a paper and provide a chapter title');
      return;
    }

    try {
      setLoading(true);
      
      // Create a new chapter object
      const chapterId = crypto.randomUUID(); // Generate a unique ID for the chapter
      const newChapterObj = {
        id: chapterId,
        title: newChapter.title,
        order: newChapter.order
      };
      
      // Update the paper with the new chapter
      const updatedChapters = [...(selectedPaper.chapters || []), newChapterObj];
      
      await updateDoc(doc(db, 'pyqPapers', selectedPaper.id), {
        chapters: updatedChapters,
        updatedAt: serverTimestamp()
      });
      
      // Update the paper in state
      const updatedPaper = {
        ...selectedPaper,
        chapters: updatedChapters
      };
      
      setPapers(prev => prev.map(paper => 
        paper.id === selectedPaper.id ? updatedPaper : paper
      ));
      
      setSelectedPaper(updatedPaper);
      
      // Reset form
      setNewChapter({
        title: '',
        order: updatedChapters.length + 1
      });
      setShowChapterForm(false);
      
    } catch (err) {
      console.error('Error adding chapter:', err);
      setError('Failed to add chapter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    if (!window.confirm('Are you sure you want to delete this paper? This will delete all associated questions and cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Delete the paper document
      await deleteDoc(doc(db, 'pyqPapers', paperId));
      
      // Delete all questions associated with this paper
      const questionsQuery = query(
        collection(db, 'mainsPYQs'),
        where('paperId', '==', paperId)
      );
      
      const questionsSnapshot = await getDocs(questionsQuery);
      const deletePromises = questionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Update state
      setPapers(prev => prev.filter(paper => paper.id !== paperId));
      
      if (selectedPaper?.id === paperId) {
        setSelectedPaper(null);
        setSelectedChapter(null);
        resetForm();
      }
      
    } catch (err) {
      console.error('Error deleting paper:', err);
      setError('Failed to delete paper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!selectedPaper) return;
    
    if (!window.confirm('Are you sure you want to delete this chapter? This will delete all associated questions and cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Filter out the chapter to delete
      const updatedChapters = selectedPaper.chapters.filter(chapter => chapter.id !== chapterId);
      
      // Update the paper document
      await updateDoc(doc(db, 'pyqPapers', selectedPaper.id), {
        chapters: updatedChapters,
        updatedAt: serverTimestamp()
      });
      
      // Delete all questions associated with this chapter
      const questionsQuery = query(
        collection(db, 'mainsPYQs'),
        where('paperId', '==', selectedPaper.id),
        where('chapterId', '==', chapterId)
      );
      
      const questionsSnapshot = await getDocs(questionsQuery);
      const deletePromises = questionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Update state
      const updatedPaper = {
        ...selectedPaper,
        chapters: updatedChapters
      };
      
      setPapers(prev => prev.map(paper => 
        paper.id === selectedPaper.id ? updatedPaper : paper
      ));
      
      setSelectedPaper(updatedPaper);
      
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null);
        resetForm();
      }
      
    } catch (err) {
      console.error('Error deleting chapter:', err);
      setError('Failed to delete chapter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (field: keyof MainsQuestion, value: string | string[]) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    if (!currentQuestion.tags.includes(newTag.trim())) {
      setCurrentQuestion(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
    }
    
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async () => {
    if (!selectedPaper || !selectedChapter) {
      return;
    }

    if (!currentQuestion.question.trim() || !currentQuestion.answer.trim()) {
      setError('Please provide both question and answer');
      return;
    }

    try {
      setLoading(true);
      
      const questionData = {
        question: currentQuestion.question,
        answer: currentQuestion.answer,
        tags: currentQuestion.tags,
        category: currentQuestion.category,
        paperId: selectedPaper.id,
        paperTitle: selectedPaper.title,
        paperYear: selectedPaper.year,
        chapterId: selectedChapter.id,
        chapterTitle: selectedChapter.title,
        examType: selectedPaper.examType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (isEditing && editingId) {
        // Update existing question
        await updateDoc(doc(db, 'mainsPYQs', editingId), {
          ...questionData,
          updatedAt: serverTimestamp()
        });
        
        // Update the questions array
        setQuestions(prev => prev.map(q => 
          q.id === editingId ? { ...questionData, id: editingId } : q
        ));
      } else {
        // Add new question
        const docRef = await addDoc(collection(db, 'mainsPYQs'), questionData);
        
        // Add the new question to the array
        setQuestions(prev => [...prev, { ...questionData, id: docRef.id }]);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error saving question:', err);
      setError('Failed to save question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question: MainsQuestion) => {
    if (!question.id) return;
    
    setCurrentQuestion({
      question: question.question,
      answer: question.answer,
      tags: question.tags || [],
      category: question.category || 'general',
      paperId: question.paperId,
      paperTitle: question.paperTitle,
      paperYear: question.paperYear,
      chapterId: question.chapterId,
      chapterTitle: question.chapterTitle,
      examType: question.examType
    });
    
    setIsEditing(true);
    setEditingId(question.id);
  };

  const handleDelete = async (questionId: string | undefined) => {
    if (!questionId) return;
    
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'mainsPYQs', questionId));
      
      // Remove the deleted question from the array
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExamTypeChange = (examType: string) => {
    setSelectedExamType(examType);
    setSelectedPaper(null);
    setSelectedChapter(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mains PYQs Management</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {showError}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
            <div className="flex space-x-3">
              {examTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleExamTypeChange(type)}
                  className={`px-4 py-2 text-sm rounded-md ${
                    selectedExamType === type 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Paper List */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-700">Papers</h2>
                <button
                  onClick={() => setShowPaperForm(!showPaperForm)}
                  className="p-1 rounded-md text-blue-600 hover:bg-blue-50"
                  title="Add new paper"
                >
                  <FilePlus size={16} />
                </button>
              </div>
              
              {showPaperForm && (
                <div className="p-3 border-b bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Paper Title</label>
                      <input
                        type="text"
                        value={newPaper.title}
                        onChange={(e) => setNewPaper(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        placeholder="e.g. UPSC Mains 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        value={newPaper.year}
                        onChange={(e) => setNewPaper(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddPaper}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={loading}
                      >
                        Add Paper
                      </button>
                      <button
                        onClick={() => setShowPaperForm(false)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="h-96 overflow-y-auto p-2">
                {loading && papers.length === 0 ? (
                  <div className="animate-pulse p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {papers.map((paper) => (
                      <li key={paper.id}>
                        <div className="flex items-center">
                          <button
                            onClick={() => handlePaperSelect(paper)}
                            className={`flex-1 text-left px-3 py-2 rounded-md flex items-center justify-between ${
                              selectedPaper?.id === paper.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex-1 truncate">{paper.title} ({paper.year})</span>
                            {expandedPapers[paper.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePaper(paper.id);
                            }}
                            className="p-1 rounded-md text-red-500 hover:bg-gray-100"
                            title="Delete paper"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                        
                        {expandedPapers[paper.id] && (
                          <div className="ml-4 mt-1 space-y-1">
                            <div className="flex items-center justify-between px-2 py-1">
                              <span className="text-xs font-medium text-gray-500">Chapters</span>
                              <button
                                onClick={() => setShowChapterForm(!showChapterForm)}
                                className="p-1 rounded-md text-blue-600 hover:bg-blue-50"
                                title="Add new chapter"
                              >
                                <FolderPlus size={14} />
                              </button>
                            </div>
                            
                            {showChapterForm && selectedPaper?.id === paper.id && (
                              <div className="p-2 mb-2 border rounded-md bg-gray-50">
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Chapter Title</label>
                                    <input
                                      type="text"
                                      value={newChapter.title}
                                      onChange={(e) => setNewChapter(prev => ({ ...prev, title: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                      placeholder="e.g. Art & Culture"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
                                    <input
                                      type="number"
                                      value={newChapter.order}
                                      onChange={(e) => setNewChapter(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={handleAddChapter}
                                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                      disabled={loading}
                                    >
                                      Add Chapter
                                    </button>
                                    <button
                                      onClick={() => setShowChapterForm(false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <ul className="space-y-1">
                              {paper.chapters.map((chapter) => (
                                <li key={chapter.id}>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => handleChapterSelect(chapter)}
                                      className={`flex-1 text-left px-3 py-2 rounded-md ${
                                        selectedChapter?.id === chapter.id 
                                          ? 'bg-blue-50 text-blue-700' 
                                          : 'hover:bg-gray-50'
                                      }`}
                                    >
                                      {chapter.title}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChapter(chapter.id);
                                      }}
                                      className="p-1 rounded-md text-red-500 hover:bg-gray-100"
                                      title="Delete chapter"
                                    >
                                      <Trash size={14} />
                                    </button>
                                  </div>
                                </li>
                              ))}
                              {paper.chapters.length === 0 && (
                                <li className="text-xs text-gray-500 px-3 py-2">
                                  No chapters yet. Add one to get started.
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Question Form */}
            <div className="col-span-2 border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="text-sm font-medium text-gray-700">
                  {isEditing ? 'Edit Question' : 'Add New Question'}
                </h2>
              </div>
              <div className="p-4">
                {selectedPaper && selectedChapter ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <ClientOnlyRichTextEditor
                          value={currentQuestion.question}
                          onChange={(value) => handleQuestionChange('question', value)}
                          placeholder="Enter the question..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <ClientOnlyRichTextEditor
                          value={currentQuestion.answer}
                          onChange={(value) => handleQuestionChange('answer', value)}
                          placeholder="Enter the answer..."
                          rows={10}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={currentQuestion.category}
                          onChange={(e) => handleQuestionChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="general">General</option>
                          <option value="art_culture">Art & Culture</option>
                          <option value="history">History</option>
                          <option value="geography">Geography</option>
                          <option value="polity">Polity</option>
                          <option value="economy">Economy</option>
                          <option value="science">Science & Technology</option>
                          <option value="environment">Environment & Ecology</option>
                          <option value="international">International Relations</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {currentQuestion.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add a tag"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          disabled={loading}
                        >
                          {isEditing ? 'Update Question' : 'Add Question'}
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Select a paper and chapter to manage questions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Questions List */}
          {selectedPaper && selectedChapter && (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="text-sm font-medium text-gray-700">
                  Questions for {selectedPaper.title} - {selectedChapter.title}
                </h2>
              </div>
              <div className="p-4">
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-md font-medium mb-2">
                            Q.{index + 1}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(question)}
                              className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(question.id)}
                              className="p-1 rounded-md text-red-500 hover:bg-gray-100"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <div 
                          className="mb-3"
                          dangerouslySetInnerHTML={{ __html: question.question }}
                        />
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <h4 className="text-sm font-medium text-gray-800 mb-1">Answer:</h4>
                          <div 
                            className="text-sm text-gray-700 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: question.answer }}
                          />
                        </div>
                        {question.tags && question.tags.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-xs font-medium text-gray-600 mb-1">Tags:</h4>
                            <div className="flex flex-wrap gap-1">
                              {question.tags.map((tag) => (
                                <span key={tag} className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {question.category && question.category !== 'general' && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-indigo-100 text-indigo-800">
                              {question.category.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-500">
                      No questions found for this chapter. Add some using the form above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainsPYQs;
