import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Calendar, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resources = [
    {
      title: 'UPSC Notes',
      icon: BookOpen,
      description: 'Comprehensive study material for UPSC Civil Services Exam',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      hoverColor: 'hover:bg-blue-100',
      link: '/notes'
    },
    {
      title: 'APPSC Notes',
      icon: FileText,
      description: 'Complete study material for Andhra Pradesh PSC Exams',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      hoverColor: 'hover:bg-green-100',
      link: '/appsc-notes'
    },
    {
      title: 'TSPSC Notes',
      icon: BookOpen,
      description: 'Detailed notes for Telangana PSC Examinations',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      hoverColor: 'hover:bg-purple-100',
      link: '/tgpsc-notes'
    },
    {
      title: 'Current Affairs',
      icon: Newspaper,
      description: 'Daily updates on current events relevant for competitive exams',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-500',
      hoverColor: 'hover:bg-rose-100',
      link: '/current-affairs'
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
            Access our comprehensive study materials and resources to ace your competitive exam preparation
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
              <Link to={resource.link} className="block">
                <div
                  className={`${resource.bgColor} ${
                    resource.hoverColor
                  } rounded-lg p-6 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105`}
                >
                  <resource.icon className={`w-12 h-12 ${resource.iconColor} mb-4`} />
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <button className="btn-primary w-full">
                    Explore Now
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;