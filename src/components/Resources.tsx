import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Users, Target } from 'lucide-react';

const Resources = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const resources = [
    {
      title: 'Complete Study Material',
      icon: BookOpen,
      description: 'Comprehensive notes covering all UPSC subjects',
      content: [
        'GS Paper 1: History, Geography, Society',
        'GS Paper 2: Governance, International Relations',
        'GS Paper 3: Economy, Science & Technology',
        'GS Paper 4: Ethics & Integrity'
      ],
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'Previous Year Papers',
      icon: FileText,
      description: 'Solved question papers with detailed explanations',
      content: [
        'Last 10 years papers analysis',
        'Topic-wise question segregation',
        'Answer writing techniques',
        'Score improvement strategies'
      ],
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Mock Tests',
      icon: Target,
      description: 'Regular mock tests to assess your preparation',
      content: [
        'Prelims mock series',
        'Mains answer writing practice',
        'Interview preparation',
        'Performance analytics'
      ],
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      title: 'Study Groups',
      icon: Users,
      description: 'Join peer groups for collaborative learning',
      content: [
        'Daily discussion groups',
        'Weekly doubt clearing sessions',
        'Monthly revision plans',
        'Mentorship program'
      ],
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-500',
      hoverColor: 'hover:bg-rose-100'
    }
  ];

  return (
    <section id="resources" className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--primary-blue)] mb-4">
            Free Resources
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access our comprehensive study materials and resources to ace your UPSC preparation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`${resource.bgColor} ${
                  resource.hoverColor
                } rounded-lg p-6 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  activeCard === index ? 'ring-2 ring-[var(--primary-red)]' : ''
                }`}
                onClick={() => setActiveCard(activeCard === index ? null : index)}
              >
                <resource.icon className={`w-12 h-12 ${resource.iconColor} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                
                <AnimatePresence>
                  {activeCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <ul className="space-y-2 mb-4">
                        {resource.content.map((item, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <span className={`w-2 h-2 ${resource.iconColor} bg-current rounded-full mr-2`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button className="btn-primary w-full">
                        Access Now
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;