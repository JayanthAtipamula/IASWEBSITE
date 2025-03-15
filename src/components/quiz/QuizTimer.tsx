import React, { useState, useEffect } from 'react';

interface QuizTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  onTimeUp: () => void;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ 
  remainingSeconds, 
  totalSeconds, 
  onTimeUp 
}) => {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);
  
  // Update timeLeft when remainingSeconds changes
  useEffect(() => {
    setTimeLeft(remainingSeconds);
  }, [remainingSeconds]);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
        }
        return Math.max(0, newTime);
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate percentage of time remaining
  const percentageLeft = (timeLeft / totalSeconds) * 100;
  
  // Determine color based on time remaining
  const getTimerColor = (): string => {
    if (percentageLeft > 50) return 'bg-green-500';
    if (percentageLeft > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Time Remaining</h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all ${getTimerColor()}`} 
          style={{ width: `${percentageLeft}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizTimer; 