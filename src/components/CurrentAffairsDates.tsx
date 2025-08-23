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
  const [filteredDates, setFilteredDates] = useState<{ date: number; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchDates = async () => {
      try {
        setLoading(true);
        const result = await getCurrentAffairsDates(examType);
        setDates(result);
        setFilteredDates(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${examType} current affairs dates:`, err);
        setError(`Failed to load ${examType.toUpperCase()} current affairs dates. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDates, 100);
    return () => clearTimeout(timer);
  }, [isClient, examType]);

  // Filter dates based on selected date range
  useEffect(() => {
    if (dates.length === 0) return;

    let filtered = [...dates];
    const now = new Date();

    switch (dateFilter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        filtered = dates.filter(dateItem => {
          const itemDate = new Date(dateItem.date);
          return itemDate >= today && itemDate <= todayEnd;
        });
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        filtered = dates.filter(dateItem => {
          const itemDate = new Date(dateItem.date);
          return itemDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        filtered = dates.filter(dateItem => {
          const itemDate = new Date(dateItem.date);
          return itemDate >= monthAgo;
        });
        break;
      case 'custom':
        // Custom date range filtering
        if (fromDate && toDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          
          filtered = dates.filter(dateItem => {
            const itemDate = new Date(dateItem.date);
            return itemDate >= fromDateTime && itemDate <= toDateTime;
          });
        } else if (fromDate) {
          const fromDateTime = new Date(fromDate);
          fromDateTime.setHours(0, 0, 0, 0);
          filtered = dates.filter(dateItem => {
            const itemDate = new Date(dateItem.date);
            return itemDate >= fromDateTime;
          });
        } else if (toDate) {
          const toDateTime = new Date(toDate);
          toDateTime.setHours(23, 59, 59, 999);
          filtered = dates.filter(dateItem => {
            const itemDate = new Date(dateItem.date);
            return itemDate <= toDateTime;
          });
        }
        break;
      case 'all':
      default:
        // No filter, show all
        break;
    }

    setFilteredDates(filtered);
  }, [dateFilter, dates, fromDate, toDate]);

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd MMMM yyyy');
  };

  // Don't show loading screen during SSR, only on client side
  if (loading && isClient) return <LoadingScreen />;

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

      {/* Date Filter */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <CalendarDays className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filter dates:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'all' 
                ? `${getTextColorClass()} bg-opacity-10 border` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Dates
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'today' 
                ? `${getTextColorClass()} bg-opacity-10 border` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              Today
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'week' 
                ? `${getTextColorClass()} bg-opacity-10 border` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              This Week
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'month' 
                ? `${getTextColorClass()} bg-opacity-10 border` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              This Month
            </button>
            <button
              onClick={() => setDateFilter('custom')}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center ${dateFilter === 'custom' 
                ? `${getTextColorClass()} bg-opacity-10 border` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              Custom Range
            </button>
          </div>
        </div>
        
        {/* Custom Date Range Fields */}
        {dateFilter === 'custom' && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="from-date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate || undefined}
              />
            </div>
            
            <div>
              <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="to-date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || undefined}
              />
            </div>
          </div>
        )}
        
        {dateFilter !== 'all' && (
          <div className="mt-3 text-sm text-gray-500 text-center sm:text-right">
            Showing {filteredDates.length} {filteredDates.length === 1 ? 'date' : 'dates'} {dateFilter === 'today' ? 'from today' : dateFilter === 'week' ? 'from the past 7 days' : dateFilter === 'month' ? 'from the past 30 days' : 'in the selected range'}
          </div>
        )}
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
          {filteredDates.length === 0 && !loading && !error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No current affairs available{dateFilter !== 'all' ? ' for the selected date range' : ''} for {title}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDates.map((dateItem) => (
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
