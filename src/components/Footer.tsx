import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

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
              alt="Epitome IAS Logo" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-200 mb-4">
              Empowering UPSC aspirants with comprehensive study materials and expert guidance.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/epitomeiasacademy" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/EpitomeIAS" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/epitome-ias-academy" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/epitome_ias_academy" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-colors" aria-label="Instagram">
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
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" />
                <span className="text-gray-200">support@epitomeias.in</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" />
                <span className="text-gray-200">+91 70956 06639</span>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" />
                <span className="text-gray-200">Open ⋅ Closes 9 pm</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[var(--primary-red)] mr-2 mt-1" />
                <span className="text-gray-200">RTC X Roads Metro Station, Hyderabad, Telangana 500020</span>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms-and-conditions" className="text-gray-200 hover:text-white transition-colors">Terms and Conditions</a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-200 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="/refund-policy" className="text-gray-200 hover:text-white transition-colors">Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
        <p className="text-center text-gray-200">
  © {currentYear} All rights reserved @ Epitome IAS Academy. Designed & Developed by{' '}
  <a 
    href="https://webbingprotechnologies.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-white hover:text-blue-200 underline transition-colors"
  >
    Webbing Pro Technologies
  </a>
  – 9059329297.
</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;