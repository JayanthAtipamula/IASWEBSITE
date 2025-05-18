import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { getCurrentAffairsDates } from '../services/currentAffairsService';
import { ExamType } from '../services/currentAffairsService';
import LoadingScreen from './LoadingScreen';

interface CurrentAffairsDatesProps {
  examType: ExamType;
  title: string;
  color: string;
}

const CurrentAffairsDates: React.FC<CurrentAffairsDatesProps> = ({ examType, title, color }) => {
  const [dates, setDates] = useState<{ date: number; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        setLoading(true);
        const result = await getCurrentAffairsDates(examType);
        setDates(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${examType} current affairs dates:`, err);
        setError(`Failed to load ${examType.toUpperCase()} current affairs dates. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [examType]);

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd MMMM yyyy');
  };

  if (loading) return <LoadingScreen />;

  // Generate dynamic classes based on color prop
  const getBgColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      case 'purple': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  const getTextColorClass = () => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const getHoverColorClass = () => {
    switch (color) {
      case 'blue': return 'hover:bg-blue-50';
      case 'green': return 'hover:bg-green-50';
      case 'purple': return 'hover:bg-purple-50';
      default: return 'hover:bg-blue-50';
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Select a date to view the current affairs for {title}.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`${getBgColorClass()} p-4`}>
          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Available Dates</h2>
          </div>
        </div>
        <div className="p-6">
          {dates.length === 0 && !loading && !error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No current affairs available yet for {title}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dates.map((dateItem) => (
                <Link 
                  to={`/current-affairs/${examType}/${dateItem.date}`} 
                  key={dateItem.date}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${getHoverColorClass()} transition-colors`}
                >
                  <div className="flex flex-col">
                    <span className={`${getTextColorClass()} font-medium`}>
                      {formatDate(dateItem.date)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {dateItem.count} {dateItem.count === 1 ? 'article' : 'articles'}
                    </span>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${getTextColorClass()} flex-shrink-0`} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsDates;
