import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { createMessage } from '../services/messageService';
import { ContactMessageFormData } from '../types/message';

const Contact = () => {
  const [formData, setFormData] = useState<ContactMessageFormData>({
    name: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phoneNumber || !formData.message) {
      setError('Please fill out all fields.');
      return;
    }

    // Simple phone number validation (should have at least 10 digits)
    const phoneRegex = /^[0-9+\- ]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createMessage(formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        phoneNumber: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--primary-blue)] mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help you achieve your UPSC goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">support@epitomeias.in</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">+91 70956 06639</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-gray-600">Open ⋅ Closes 9 pm</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-[var(--primary-red)] mr-4 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">Epitome IAS, 1st Floor, 1-1-101/A, RTC X Rd, above Pizza Hut, Vivek nagar, Ashok Nagar, Hyderabad, Telangana 500020</p>
                  <p className="text-gray-600 mt-1">Located in: RTC X Roads Metro Station</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com/epitomeiasacademy" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                  <Facebook className="w-5 h-5 text-[var(--primary-blue)]" />
                </a>
                <a href="https://instagram.com/epitome_ias_academy" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-pink-100 transition-colors">
                  <Instagram className="w-5 h-5 text-[var(--primary-red)]" />
                </a>
                <a href="https://x.com/EpitomeIAS" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                  <Twitter className="w-5 h-5 text-[var(--primary-blue)]" />
                </a>
                <a href="https://linkedin.com/in/epitome-ias-academy" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                  <Linkedin className="w-5 h-5 text-[var(--primary-blue)]" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-xl font-medium text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700 mb-4">
                  Thank you for contacting us. We will get back to you soon.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)]"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)]"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)]"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full flex justify-center items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;