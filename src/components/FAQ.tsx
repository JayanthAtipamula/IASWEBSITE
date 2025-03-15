import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How should I start my UPSC preparation?",
      answer: "Start by understanding the UPSC syllabus thoroughly, create a study plan, gather standard resources, and focus on building a strong foundation in basic concepts. Regular newspaper reading and current affairs analysis are essential from day one."
    },
    {
      question: "What is the best time to start UPSC preparation?",
      answer: "The ideal time to start UPSC preparation is right after graduation. However, it's never too late to start if you're dedicated. Early preparation gives you enough time to cover the vast syllabus and attempt multiple mocks."
    },
    {
      question: "How many hours should I study daily?",
      answer: "Quality matters more than quantity. Aim for 6-8 hours of focused study daily. Maintain consistency rather than studying for long hours irregularly. Include breaks and revision time in your schedule."
    },
    {
      question: "Is coaching necessary for UPSC preparation?",
      answer: "Coaching is not mandatory but can provide structured guidance. Many successful candidates have cleared the exam through self-study. What matters most is your dedication, consistency, and the right study material."
    },
    {
      question: "How to prepare for UPSC while working?",
      answer: "Working professionals should focus on smart study techniques, utilize weekends effectively, and maintain a balanced schedule. Digital resources and recorded lectures can be particularly helpful. Consider taking leave closer to the exam."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--primary-blue)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about UPSC preparation
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                className="w-full text-left bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-[var(--primary-red)]" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-[var(--primary-red)]" />
                )}
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white px-6 pb-6 rounded-b-lg shadow-md"
                  >
                    <p className="text-gray-600 mt-4">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;