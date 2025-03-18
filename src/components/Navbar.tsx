import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { title: 'Home', href: '/' },
    { title: 'Resources', href: '/#resources' },
    { title: 'UPSC Notes', href: '/upsc-notes' },
    { title: 'Testimonials', href: '/#testimonials' },
    { title: 'FAQ', href: '/#faq' },
    { title: 'Contact', href: '/#contact' },
    { title: 'Quizzes', href: '/quizzes' },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png" 
                alt="UPSC Guide Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={`nav-link ${
                  location.pathname === item.href ? 'text-blue-600' : ''
                }`}
              >
                {item.title}
              </Link>
            ))}
            {user ? (
              <Link to="/admin" className="flex items-center btn-primary">
                Admin Panel
              </Link>
            ) : (
              <Link to="/admin/login" className="flex items-center btn-primary">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base nav-link ${
                      location.pathname === item.href ? 'text-blue-600' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                {user ? (
                  <Link
                    to="/admin"
                    className="flex items-center btn-primary w-full justify-center mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    className="flex items-center btn-primary w-full justify-center mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;