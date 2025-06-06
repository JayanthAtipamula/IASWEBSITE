import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  order: number;
  questions?: any[];
}

interface Paper {
  id: string;
  title: string;
  year: number;
  examType: string;
  paperType: string;
  chapters: Chapter[];
  createdAt: Date;
}

const PaperSelectionPage: React.FC = () => {
  const { examType = 'upsc' } = useParams<{ examType?: string }>();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            chapters: data.chapters || [],
            createdAt: data.createdAt?.toDate() || new Date()
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
  }, [examType]);

  const handlePaperClick = (paper: Paper) => {
    navigate(`/pyqs/prelims/${examType}/paper/${paper.id}`);
  };

  const examTitle = examType === 'upsc' ? 'UPSC' : 
                   examType === 'tgpsc' ? 'TGPSC' : 
                   examType === 'appsc' ? 'APPSC' : 'Prelims';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-white rounded-lg shadow"></div>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {examTitle} Previous Year Papers
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Select a paper to view its questions and start practicing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => handlePaperClick(paper)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    {paper.year}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {paper.title}
                </h3>
                <div className="text-sm text-gray-600">
                  <p>Chapters: {paper.chapters.length}</p>
                  <p>Questions: {paper.chapters.reduce((total, chapter) => total + (chapter.questions?.length || 0), 0)}</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Start Practice →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperSelectionPage; 