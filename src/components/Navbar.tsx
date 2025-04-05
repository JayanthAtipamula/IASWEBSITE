import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, LogOut, User, Settings, Phone, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  // Effect to handle scrolling after navigation
  useEffect(() => {
    // Check for pending scroll either from state or sessionStorage
    const storedPendingScroll = sessionStorage.getItem('pendingScroll');
    const currentPendingScroll = pendingScroll || storedPendingScroll;
    
    if (currentPendingScroll && location.pathname === '/') {
      const element = document.getElementById(currentPendingScroll);
      if (element) {
        // Use a longer delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          // Clear both state and sessionStorage
          setPendingScroll(null);
          sessionStorage.removeItem('pendingScroll');
        }, 1000); // Increased to 1000ms for better reliability
      }
    } else if (location.pathname !== '/') {
      // Reset scroll position for non-home pages
      window.scrollTo(0, 0);
    }
  }, [location.pathname, pendingScroll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { title: 'Courses', href: '/courses' },
    { title: 'Current Affairs', href: '/current-affairs' },
    { title: 'Contact', href: '/#contact' },
    { title: 'Quizzes', href: '/quizzes' },
  ];
  
  const dropdownItems = [
    {
      title: 'UPSC',
      items: [
        { title: 'Notes', href: '/upsc-notes' }
      ]
    },
    {
      title: 'TGPSC',
      items: [
        { title: 'Notes', href: '/tgpsc-notes' }
      ]
    },
    {
      title: 'APPSC',
      items: [
        { title: 'Notes', href: '/appsc-notes' }
      ]
    }
  ];

  const handleNavigation = (href: string) => {
    // For notes pages, force a full page reload to ensure proper filtering
    if (href.includes('-notes')) {
      window.location.href = href;
      return;
    }
    
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      
      // If we're not on the home page, navigate and set both state and sessionStorage
      if (location.pathname !== '/') {
        setPendingScroll(sectionId);
        // Store in sessionStorage to persist across navigation
        sessionStorage.setItem('pendingScroll', sectionId);
        navigate('/');
      } else {
        // If we're already on home page, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // For non-hash routes, navigate and scroll to top
      navigate(href);
      window.scrollTo(0, 0);
    }
    
    // Close menus
    setIsOpen(false);
    setUserMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button onClick={() => handleNavigation('/')} className="focus:outline-none">
              <img 
                src="https://i.postimg.cc/qMYWSV1h/Untitled-design-12.png" 
                alt="UPSC Guide Logo" 
                className="h-12 w-auto"
              />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Dropdown menus */}
            {dropdownItems.map((dropdown) => (
              <div 
                key={dropdown.title} 
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => handleDropdownToggle(e, dropdown.title)}
                  className="flex items-center space-x-1 nav-link"
                >
                  <span>{dropdown.title}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {activeDropdown === dropdown.title && (
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                    {dropdown.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleNavigation(item.href)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Regular menu items */}
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.href)}
                className={`nav-link ${
                  location.pathname === item.href ? 'text-blue-600' : ''
                }`}
              >
                {item.title}
              </button>
            ))}

            {/* Let's Talk Button */}
            <a 
              href="tel:+919876543210" 
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Let's Talk
            </a>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button 
                      onClick={() => handleNavigation('/profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Your Profile
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleNavigation('/admin')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => handleNavigation('/login')} className="flex items-center btn-primary">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </button>
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
                {/* Mobile dropdown menus */}
                {dropdownItems.map((dropdown) => (
                  <div key={dropdown.title} className="py-1">
                    <button
                      onClick={(e) => handleDropdownToggle(e, dropdown.title)}
                      className="flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-base nav-link"
                    >
                      <span>{dropdown.title}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {activeDropdown === dropdown.title && (
                      <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200">
                        {dropdown.items.map((item) => (
                          <button
                            key={item.title}
                            onClick={() => handleNavigation(item.href)}
                            className="block w-full text-left px-3 py-2 text-sm nav-link"
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile regular menu items */}
                {menuItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item.href)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base nav-link ${
                      location.pathname === item.href ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.title}
                  </button>
                ))}

                {/* Let's Talk Button (Mobile) */}
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300 w-full mt-2"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Let's Talk
                </a>
                
                {user ? (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center px-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'User'} 
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {user.displayName || user.email}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center w-full text-left px-3 py-2 text-base nav-link"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Your Profile
                    </button>
                    
                    {isAdmin && (
                      <button
                        onClick={() => handleNavigation('/admin')}
                        className="flex items-center w-full text-left px-3 py-2 text-base nav-link"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </button>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-3 py-2 text-base nav-link"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="flex items-center btn-primary w-full justify-center mt-4"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in
                  </button>
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