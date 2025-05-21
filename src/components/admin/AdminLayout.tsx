import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  LogOut,
  Menu,
  X,
  BookOpen,
  BarChart,
  Image,
  FileEdit,
  GraduationCap,
  MessageSquare,
  Type,
  ClipboardCheck,
  FileQuestion
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Blog Posts', path: '/admin/posts', icon: <FileText className="w-5 h-5" /> },
    { title: 'Categories', path: '/admin/categories', icon: <Tag className="w-5 h-5" /> },
    { title: 'Custom Pages', path: '/admin/custom-pages', icon: <FileEdit className="w-5 h-5" /> },
    { title: 'Banners', path: '/admin/banners', icon: <Image className="w-5 h-5" /> },
    { title: 'Marquee Items', path: '/admin/marquee-items', icon: <Type className="w-5 h-5" /> },
    { title: 'Courses', path: '/admin/courses', icon: <GraduationCap className="w-5 h-5" /> },
    { title: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'Quizzes', path: '/admin/quizzes', icon: <BookOpen className="w-5 h-5" /> },
    { title: 'Quiz Attempts', path: '/admin/quiz-attempts', icon: <BarChart className="w-5 h-5" /> },
    { title: 'Prelims MCQs', path: '/admin/prelims-mcqs', icon: <ClipboardCheck className="w-5 h-5" /> },
    { title: 'Mains PYQs', path: '/admin/mains-pyqs', icon: <FileQuestion className="w-5 h-5" /> },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out z-30
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                ${location.pathname === item.path 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center px-4 sticky top-0 z-10">
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
