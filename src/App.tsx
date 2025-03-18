import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Resources from './components/Resources';
import About from './components/About';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';

// UPSC Notes Pages
import BlogIndex from './pages/blog/BlogIndex';
import BlogPost from './pages/blog/BlogPost';
import CategoryPage from './pages/blog/CategoryPage';

// Admin Pages
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogPosts from './pages/admin/BlogPosts';
import BlogPostEditor from './pages/admin/BlogPostEditor';
import Categories from './pages/admin/Categories';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div>
              <Hero />
              <Resources />
              <About />
              <Testimonials />
              <FAQ />
              <Contact />
            </div>
          } />
          
          {/* Quiz Routes */}
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          
          {/* UPSC Notes Routes */}
          <Route path="/upsc-notes" element={<BlogIndex />} />
          <Route path="/upsc-notes/:slug" element={<BlogPost />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<BlogPosts />} />
            <Route path="posts/new" element={<BlogPostEditor />} />
            <Route path="posts/edit/:id" element={<BlogPostEditor />} />
            <Route path="categories" element={<Categories />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;