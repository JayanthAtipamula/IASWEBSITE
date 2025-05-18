import React, { useState, useEffect } from 'react';

interface QuizTimerProps {
  startTime: number;
  totalSeconds: number;
  onTimeUp: () => void;
  onSubmit?: (timeSpent: number) => void;
  disableTimer?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ 
  startTime, 
  totalSeconds, 
  onTimeUp,
  onSubmit,
  disableTimer
}) => {
  const [timeLeft, setTimeLeft] = useState(disableTimer ? 0 : totalSeconds);
  
  // Initialize timer on component mount
  useEffect(() => {
    if (disableTimer) return;
    // Calculate elapsed time and update remaining time
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const newRemainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    setTimeLeft(newRemainingSeconds);
    
    if (newRemainingSeconds <= 0) {
      onTimeUp();
    }
  }, [startTime, totalSeconds, onTimeUp, disableTimer]);
  
  useEffect(() => {
    if (disableTimer) {
      return; // Timer is disabled, do nothing
    }
    if (timeLeft <= 0) {
      onTimeUp(); // Time is up and timer is active
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
  }, [timeLeft, onTimeUp, disableTimer]);
  
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
  
  // Handle manual submission
  const handleSubmit = () => {
    if (onSubmit) {
      const timeSpent = totalSeconds - timeLeft;
      onSubmit(timeSpent);
    }
  };
  
  if (disableTimer) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Mains Practice Mode</h3>
        <p className="text-sm text-gray-600 text-center">Timer is disabled for this quiz type. Take your time to review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Remaining</h3>
      
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all ${getTimerColor()}`} 
          style={{ width: `${percentageLeft}%` }}
        ></div>
      </div>
      
      {onSubmit && (
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
};

export default QuizTimer; 