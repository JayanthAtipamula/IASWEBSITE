import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--primary-blue)] text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <img 
              src="https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png" 
              alt="UPSC Guide Logo" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-200 mb-4">
              Empowering UPSC aspirants with comprehensive study materials and expert guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#resources" className="text-gray-200 hover:text-white transition-colors">Resources</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-200 hover:text-white transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#faq" className="text-gray-200 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-200 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-[var(--primary-red)] mr-2" />
                <span className="text-gray-200">contact@upscguide.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-[var(--primary-red)] mr-2" />
                <span className="text-gray-200">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-[var(--primary-red)] mr-2" />
                <span className="text-gray-200">123 Study Center, New Delhi, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-200 mb-4">Subscribe to get updates on new resources and exam tips.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
              />
              <button type="submit" className="w-full btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-gray-200">
            © {currentYear} UPSC Guide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;