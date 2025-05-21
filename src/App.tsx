import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarqueeBanner from './components/MarqueeBanner';
import Hero from './components/Hero';
import Resources from './components/Resources';
import About from './components/About';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';
import PrelimsPracticePage from './pages/quiz/PrelimsPracticePage';
import MainsPracticePage from './pages/quiz/MainsPracticePage';
import TGPSCPrelimsPracticePage from './pages/quiz/TGPSCPrelimsPracticePage';
import TGPSCMainsPracticePage from './pages/quiz/TGPSCMainsPracticePage';
import APPSCPrelimsPracticePage from './pages/quiz/APPSCPrelimsPracticePage';
import APPSCMainsPracticePage from './pages/quiz/APPSCMainsPracticePage';
import PYQSPrelimsPage from './pages/pyqs/PrelimsPage';
import CoursesPage from './pages/CoursesPage';
import CurrentAffairsPage from './pages/CurrentAffairsPage';
import UPSCCurrentAffairsPage from './pages/UPSCCurrentAffairsPage';
import TGPSCCurrentAffairsPage from './pages/TGPSCCurrentAffairsPage';
import APPSCCurrentAffairsPage from './pages/APPSCCurrentAffairsPage';
import UPSCCurrentAffairsDetailPage from './pages/UPSCCurrentAffairsDetailPage';
import TGPSCCurrentAffairsDetailPage from './pages/TGPSCCurrentAffairsDetailPage';
import CurrentAffairsDebug from './pages/CurrentAffairsDebug';
import APPSCCurrentAffairsDetailPage from './pages/APPSCCurrentAffairsDetailPage';
import CurrentAffairsRawData from './pages/CurrentAffairsRawData';
import FirebaseConnectionTest from './components/FirebaseConnectionTest';

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
import PrelimsMCQs from './pages/admin/PrelimsMCQs';
import MainsPYQs from './pages/admin/MainsPYQs';
import MainsPage from './pages/pyqs/MainsPage';
import AdminCourses from './pages/admin/Courses';
import Messages from './pages/admin/Messages';
import MarqueeItems from './pages/admin/MarqueeItems';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <MarqueeBanner />
        <div className="pt-12">
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
          
          {/* PYQs Routes */}
          <Route path="/pyqs/prelims/:examType" element={
            <ProtectedRoute requireAdmin={false}>
              <PYQSPrelimsPage />
            </ProtectedRoute>
          } />
          {/* Quiz Practice Routes */}
          <Route path="/prelims-practice" element={<PrelimsPracticePage />} />
          <Route path="/mains-practice" element={<MainsPracticePage />} />
          <Route path="/tgpsc-prelims-practice" element={<TGPSCPrelimsPracticePage />} />
          <Route path="/tgpsc-mains-practice" element={<TGPSCMainsPracticePage />} />
          <Route path="/appsc-prelims-practice" element={<APPSCPrelimsPracticePage />} />
          <Route path="/appsc-mains-practice" element={<APPSCMainsPracticePage />} />
          
          {/* Courses Route */}
          <Route path="/courses" element={<CoursesPage />} />
          
          {/* Current Affairs Routes */}
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          <Route path="/current-affairs/upsc" element={<UPSCCurrentAffairsPage />} />
          <Route path="/current-affairs/tgpsc" element={<TGPSCCurrentAffairsPage />} />
          <Route path="/current-affairs/appsc" element={<APPSCCurrentAffairsPage />} />
          <Route path="/current-affairs/upsc/:dateParam" element={<UPSCCurrentAffairsDetailPage />} />
          <Route path="/current-affairs/tgpsc/:dateParam" element={<TGPSCCurrentAffairsDetailPage />} />
          <Route path="/current-affairs/appsc/:dateParam" element={<APPSCCurrentAffairsDetailPage />} />
          
          {/* Current Affairs Article Routes */}
          <Route path="/current-affairs/upsc/:dateParam/:slug" element={<BlogPost isCurrentAffair={true} examType="upsc" />} />
          <Route path="/current-affairs/tgpsc/:dateParam/:slug" element={<BlogPost isCurrentAffair={true} examType="tgpsc" />} />
          <Route path="/current-affairs/appsc/:dateParam/:slug" element={<BlogPost isCurrentAffair={true} examType="appsc" />} />
          
          {/* Notes Routes */}
          <Route path="/notes" element={<BlogIndex />} />
          <Route path="/notes/:slug" element={<BlogPost />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          
          {/* Exam Specific Notes Routes */}
          <Route path="/upsc-notes" element={<CustomPageView isExamPage="upsc" />} />
          <Route path="/appsc-notes" element={<CustomPageView isExamPage="appsc" />} />
          <Route path="/tgpsc-notes" element={<CustomPageView isExamPage="tgpsc" />} />
          
          {/* PYQs Routes */}
          <Route path="/pyqs/prelims/:examType" element={<PYQSPrelimsPage />} />
          <Route path="/pyqs/mains/:examType" element={<MainsPage />} />
          

          
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
            <Route path="prelims-mcqs" element={<PrelimsMCQs />} />
            <Route path="mains-pyqs" element={<MainsPYQs />} />
            <Route path="marquee-items" element={<MarqueeItems />} />
            <Route path="firebase-test" element={<FirebaseConnectionTest />} />
          </Route>
          
          {/* Debug Routes */}
          <Route path="/current-affairs-debug" element={<CurrentAffairsDebug />} />
          <Route path="/current-affairs-raw" element={<CurrentAffairsRawData />} />
          
          {/* Firebase Connection Test Route (for development) */}
          <Route path="/firebase-test" element={<FirebaseConnectionTest />} />
          
          {/* Legal Pages */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
          {/* Exam-specific PYQs Routes */}
          <Route path="/upsc-mains-pyqs" element={<MainsPage examType="upsc" />} />
          <Route path="/tgpsc-mains-pyqs" element={<MainsPage examType="tgpsc" />} />
          <Route path="/appsc-mains-pyqs" element={<MainsPage examType="appsc" />} />
          
          {/* Custom Pages & Blog Posts at Root Level - Must be after all other routes */}
          <Route path="/:slug" element={<CustomPageView />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;