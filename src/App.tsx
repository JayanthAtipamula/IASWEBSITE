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
import CoursesPage from './pages/CoursesPage';
import CurrentAffairsPage from './pages/CurrentAffairsPage';

// Notes Pages
import BlogIndex from './pages/blog/BlogIndex';
import BlogPost from './pages/blog/BlogPost';
import CategoryPage from './pages/blog/CategoryPage';

// Auth Pages
import UserLogin from './pages/Login';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogPosts from './pages/admin/BlogPosts';
import BlogPostEditor from './pages/admin/BlogPostEditor';
import Categories from './pages/admin/Categories';
import Quizzes from './pages/admin/Quizzes';
import QuizEditor from './pages/admin/QuizEditor';
import QuizAttempts from './pages/admin/QuizAttempts';
import Banners from './pages/admin/Banners';
import CustomPages from './pages/admin/CustomPages';
import CustomPageView from './pages/CustomPageView';
import AdminCourses from './pages/admin/Courses';
import Messages from './pages/admin/Messages';

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
          
          {/* Auth Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/profile" element={
            <ProtectedRoute requireAdmin={false}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Quiz Routes */}
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quiz/:quizId" element={
            <ProtectedRoute requireAdmin={false}>
              <QuizPage />
            </ProtectedRoute>
          } />
          
          {/* Courses Route */}
          <Route path="/courses" element={<CoursesPage />} />
          
          {/* Current Affairs Route */}
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          
          {/* Notes Routes */}
          <Route path="/notes" element={<BlogIndex />} />
          <Route path="/notes/:slug" element={<BlogPost />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          
          {/* Exam Specific Notes Routes */}
          <Route path="/upsc-notes" element={<BlogIndex />} />
          <Route path="/tgpsc-notes" element={<BlogIndex />} />
          <Route path="/appsc-notes" element={<BlogIndex />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<BlogPosts />} />
            <Route path="posts/new" element={<BlogPostEditor />} />
            <Route path="posts/edit/:id" element={<BlogPostEditor />} />
            <Route path="categories" element={<Categories />} />
            <Route path="custom-pages" element={<CustomPages />} />
            <Route path="banners" element={<Banners />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quizzes/new" element={<QuizEditor />} />
            <Route path="quizzes/edit/:id" element={<QuizEditor />} />
            <Route path="quiz-attempts" element={<QuizAttempts />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          
          {/* Custom Pages & Blog Posts at Root Level - Must be after all other routes */}
          <Route path="/:slug" element={<CustomPageView />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;