import React from 'react';

const MarqueeBanner: React.FC = () => {
  // Hardcoded course names for the marquee
  const courseNames = [
    'UPSC Civil Services Exam Preparation',
    'TGPSC Group I Comprehensive Course',
    'APPSC Group I Complete Study Program',
    'Indian Economy for UPSC',
    'Indian Polity for Civil Services',
    'Geography for UPSC and State PSCs',
    'Modern History Crash Course',
    'Environment and Ecology',
    'Current Affairs Monthly Magazine'
  ];

  return (
    <div 
      className="fixed top-16 left-0 right-0 bg-blue-600 text-white font-semibold py-3 z-50 shadow-md"
      style={{ borderBottom: '2px solid #1e40af' }}
    >
      <div className="container mx-auto px-4 overflow-hidden">
        <div className="flex space-x-8 animate-marquee">
          {courseNames.map((course, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              <span>{course}</span>
              <span className="mx-3 text-blue-300">•</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {courseNames.map((course, index) => (
            <div key={`dup-${index}`} className="flex items-center whitespace-nowrap">
              <span>{course}</span>
              <span className="mx-3 text-blue-300">•</span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
};

export default MarqueeBanner;
