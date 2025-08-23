import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, addDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen, Edit, Trash, ChevronDown, ChevronUp, Plus, Minus, FilePlus, FolderPlus } from 'lucide-react';
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

interface MCQuestion {
  id?: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

interface PaperWithMCQs extends Paper {
  mcqs?: MCQuestion[];
}

const PrelimsMCQs: React.FC = () => {
  // For paper and chapter management
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: '',
    year: new Date().getFullYear(),
    examType: 'upsc',
    paperType: 'prelims'
  });
  const [newChapter, setNewChapter] = useState({
    title: '',
    order: 1
  });
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperWithMCQs | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [mcqs, setMcqs] = useState<MCQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  // State for handling errors and showing them in the UI when needed
  const [expandedPapers, setExpandedPapers] = useState<Record<string, boolean>>({});
  const [currentMCQ, setCurrentMCQ] = useState<MCQuestion>({
    question: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [examTypes] = useState(['upsc', 'tgpsc', 'appsc']);
  const [selectedExamType, setSelectedExamType] = useState('upsc');

  // Fetch papers for the selected exam type
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'pyqPapers'),
          where('examType', '==', selectedExamType),
          where('paperType', '==', 'prelims')
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

  // Fetch MCQs when a chapter is selected
  useEffect(() => {
    const fetchMCQs = async () => {
      if (!selectedPaper || !selectedChapter) {
        setMcqs([]);
        return;
      }
      
      try {
        setLoading(true);
        const q = query(
          collection(db, 'prelimsMCQs'),
          where('paperId', '==', selectedPaper.id),
          where('chapterId', '==', selectedChapter.id)
        );
        
        const querySnapshot = await getDocs(q);
        const mcqsData: MCQuestion[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          mcqsData.push({
            id: doc.id,
            question: data.question,
            options: data.options,
            correctOption: data.correctOption,
            explanation: data.explanation
          });
        });
        
        setMcqs(mcqsData);
        
      } catch (err) {
        console.error('Error fetching MCQs:', err);
        setError('Failed to load MCQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMCQs();
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
    setCurrentMCQ({
      question: '',
      options: ['', '', '', ''],
      correctOption: 0,
      explanation: ''
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
        paperType: 'prelims',
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
        paperType: 'prelims'
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
    if (!window.confirm('Are you sure you want to delete this paper? This will delete all associated MCQs and cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Delete the paper document
      await deleteDoc(doc(db, 'pyqPapers', paperId));
      
      // Delete all MCQs associated with this paper
      const mcqsQuery = query(
        collection(db, 'prelimsMCQs'),
        where('paperId', '==', paperId)
      );
      
      const mcqsSnapshot = await getDocs(mcqsQuery);
      const deletePromises = mcqsSnapshot.docs.map(doc => deleteDoc(doc.ref));
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
    
    if (!window.confirm('Are you sure you want to delete this chapter? This will delete all associated MCQs and cannot be undone.')) {
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
      
      // Delete all MCQs associated with this chapter
      const mcqsQuery = query(
        collection(db, 'prelimsMCQs'),
        where('paperId', '==', selectedPaper.id),
        where('chapterId', '==', chapterId)
      );
      
      const mcqsSnapshot = await getDocs(mcqsQuery);
      const deletePromises = mcqsSnapshot.docs.map(doc => deleteDoc(doc.ref));
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

  const handleMCQChange = (field: keyof MCQuestion, value: string | string[] | number) => {
    setCurrentMCQ((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentMCQ.options];
    newOptions[index] = value;
    setCurrentMCQ((prev) => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    if (currentMCQ.options.length >= 6) {
      setError('Maximum of 6 options allowed');
      return;
    }
    setCurrentMCQ((prev) => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (currentMCQ.options.length <= 2) {
      setError('Minimum of 2 options required');
      return;
    }
    
    const newOptions = [...currentMCQ.options];
    newOptions.splice(index, 1);
    
    let newCorrectOption = currentMCQ.correctOption;
    // Adjust the correct option index if needed
    if (index === currentMCQ.correctOption) {
      newCorrectOption = 0; // Default to first option if the correct one is removed
    } else if (index < currentMCQ.correctOption) {
      newCorrectOption = currentMCQ.correctOption - 1; // Adjust index if an option before the correct one is removed
    }
    
    setCurrentMCQ((prev) => ({
      ...prev,
      options: newOptions,
      correctOption: newCorrectOption
    }));
  };

  const handleSubmit = async () => {
    if (!selectedPaper || !selectedChapter) {
      return;
    }

    try {
      setLoading(true);
      
      const mcqData = {
        question: currentMCQ.question,
        options: currentMCQ.options,
        correctOption: currentMCQ.correctOption,
        explanation: currentMCQ.explanation,
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
        // Update existing MCQ
        await updateDoc(doc(db, 'prelimsMCQs', editingId), {
          ...mcqData,
          updatedAt: serverTimestamp()
        });
        
        // Update the MCQs array
        setMcqs(prev => prev.map(mcq => 
          mcq.id === editingId ? { ...mcqData, id: editingId } : mcq
        ));
      } else {
        // Add new MCQ
        const docRef = await addDoc(collection(db, 'prelimsMCQs'), mcqData);
        
        // Add the new MCQ to the array
        setMcqs(prev => [...prev, { ...mcqData, id: docRef.id }]);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error saving MCQ:', err);
      setError('Failed to save MCQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mcq: MCQuestion) => {
    if (!mcq.id) return;
    
    setCurrentMCQ({
      question: mcq.question,
      options: mcq.options,
      correctOption: mcq.correctOption,
      explanation: mcq.explanation
    });
    
    setIsEditing(true);
    setEditingId(mcq.id);
  };

  const handleDelete = async (mcqId: string | undefined) => {
    if (!mcqId) return;
    
    if (!window.confirm('Are you sure you want to delete this MCQ?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'prelimsMCQs', mcqId));
      
      // Remove the deleted MCQ from the array
      setMcqs(prev => prev.filter(mcq => mcq.id !== mcqId));
    } catch (err) {
      console.error('Error deleting MCQ:', err);
      setError('Failed to delete MCQ. Please try again.');
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
        <h1 className="text-2xl font-semibold text-gray-900">Prelims MCQs Management</h1>
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
                        placeholder="e.g. UPSC 2023"
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
                                      placeholder="e.g. Chapter 1"
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

            {/* MCQ Form */}
            <div className="col-span-2 border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="text-sm font-medium text-gray-700">
                  {isEditing ? 'Edit MCQ' : 'Add New MCQ'}
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
                          value={currentMCQ.question}
                          onChange={(value) => handleMCQChange('question', value)}
                          placeholder="Enter the question..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options
                        </label>
                        <div className="space-y-2">
                          {currentMCQ.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={currentMCQ.correctOption === index}
                                onChange={() => handleMCQChange('correctOption', index)}
                                className="mr-2"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Option ${index + 1}`}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="p-1 rounded-md text-red-500 hover:bg-gray-100"
                                title="Remove option"
                              >
                                <Minus size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addOption}
                            className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Plus size={16} className="mr-1" /> Add Option
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Select the radio button next to the correct option.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Explanation
                        </label>
                        <ClientOnlyRichTextEditor
                          value={currentMCQ.explanation}
                          onChange={(value) => handleMCQChange('explanation', value)}
                          placeholder="Enter the explanation..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          disabled={loading}
                        >
                          {isEditing ? 'Update MCQ' : 'Add MCQ'}
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
                      Select a paper and chapter to manage MCQs
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* MCQs List */}
          {selectedPaper && selectedChapter && (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="text-sm font-medium text-gray-700">
                  MCQs for {selectedPaper.title} - {selectedChapter.title}
                </h2>
              </div>
              <div className="p-4">
                {mcqs.length > 0 ? (
                  <div className="space-y-4">
                    {mcqs.map((mcq, index) => (
                      <div key={mcq.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-md font-medium mb-2">
                            Question {index + 1}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(mcq)}
                              className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(mcq.id)}
                              className="p-1 rounded-md text-red-500 hover:bg-gray-100"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <div 
                          className="mb-3"
                          dangerouslySetInnerHTML={{ __html: mcq.question }}
                        />
                        <div className="space-y-1 mb-3">
                          {mcq.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`p-2 rounded-md ${
                                mcq.correctOption === optIndex 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              {optIndex === mcq.correctOption && (
                                <span className="text-green-600 font-medium">✓ </span>
                              )}
                              {option}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md">
                          <h4 className="text-sm font-medium text-blue-800 mb-1">Explanation:</h4>
                          <div 
                            className="text-sm text-blue-700"
                            dangerouslySetInnerHTML={{ __html: mcq.explanation }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-500">
                      No MCQs found for this chapter. Add some using the form above.
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

export default PrelimsMCQs;
