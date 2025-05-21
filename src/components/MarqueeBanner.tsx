import React, { useState, useEffect } from 'react';
import { getActiveMarqueeItems, MarqueeItem } from '../services/marqueeService';

const MarqueeBanner: React.FC = () => {
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  
  // Fallback course names in case no items are found in the database
  const fallbackItems = [
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

  useEffect(() => {
    const fetchMarqueeItems = async () => {
      try {
        console.log('Fetching marquee items...');
        const items = await getActiveMarqueeItems();
        console.log('Fetched marquee items:', items);
        setMarqueeItems(items);
      } catch (error) {
        console.error('Error fetching marquee items:', error);
      }
    };

    fetchMarqueeItems();
  }, []);

  useEffect(() => {
    // Log whenever marquee items change
    console.log('Marquee items state updated:', marqueeItems);
  }, [marqueeItems]);

  // Use fallback items if no items are found in the database or while loading
  const displayItems = marqueeItems.length > 0 ? marqueeItems : fallbackItems.map(text => ({
    id: `fallback-${text}`,
    text,
    active: true,
    order: 0,
    createdAt: new Date()
  }));
  


  return (
    <div 
      className="fixed top-16 left-0 right-0 bg-blue-600 text-white font-semibold py-3 z-40 shadow-md"
      style={{ borderBottom: '2px solid #1e40af' }}
    >

      <div className="container mx-auto px-4 overflow-hidden">
        <div className="flex space-x-8 animate-marquee">
          {displayItems.map((item, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              {item.link ? (
                <a href={item.link} className="hover:text-blue-200 transition-colors">
                  <span>{item.text}</span>
                </a>
              ) : (
                <span>{item.text}</span>
              )}
              <span className="mx-3 text-blue-300">•</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {displayItems.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center whitespace-nowrap">
              {item.link ? (
                <a href={item.link} className="hover:text-blue-200 transition-colors">
                  <span>{item.text}</span>
                </a>
              ) : (
                <span>{item.text}</span>
              )}
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
