import React from 'react';

const About = () => {
  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">About Us</h2>
            <p className="text-lg text-gray-600">
              We are dedicated to providing comprehensive IAS exam preparation resources and guidance.
              Our mission is to empower aspiring civil servants with the knowledge and tools they need
              to succeed in their UPSC journey.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Expert faculty with years of experience</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Comprehensive study materials and resources</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Personalized mentoring and guidance</p>
              </div>
            </div>
          </div>
          <div className="relative h-96 flex items-center justify-center mx-4 md:mx-8">
            <img 
              src="/aboutbanner.png" 
              alt="Epitome IAS Logo" 
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
