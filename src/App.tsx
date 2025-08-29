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
import EditorDebugTest from './pages/EditorDebugTest';

// Notes Pages
import BlogIndex from './pages/blog/BlogIndex';
import BlogsIndex from './pages/blog/BlogsIndex';
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
import PaperSelectionPage from './pages/pyqs/PaperSelectionPage';
import MainsPaperSelectionPage from './pages/pyqs/MainsPaperSelectionPage';

interface AppProps {
  initialData?: any;
}

const App: React.FC<AppProps> = ({ initialData }) => {
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
          <Route path="/quizzes" element={<QuizListPage initialData={initialData} />} />
          <Route path="/quiz/:quizId" element={
            <ProtectedRoute requireAdmin={false}>
              <QuizPage />
            </ProtectedRoute>
          } />
          
          {/* PYQs Routes */}
          <Route path="/pyqs/prelims/:examType" element={<PaperSelectionPage initialData={initialData} />} />
          <Route path="/pyqs/prelims/:examType/paper/:paperId" element={<PYQSPrelimsPage />} />
          <Route path="/pyqs/mains/:examType" element={<MainsPaperSelectionPage initialData={initialData} />} />
          <Route path="/pyqs/mains/:examType/paper/:paperId" element={<MainsPage />} />
          
          {/* Quiz Practice Routes */}
          <Route path="/prelims-practice" element={<PrelimsPracticePage initialData={initialData} />} />
          <Route path="/mains-practice" element={<MainsPracticePage initialData={initialData} />} />
          <Route path="/tgpsc-prelims-practice" element={<TGPSCPrelimsPracticePage initialData={initialData} />} />
          <Route path="/tgpsc-mains-practice" element={<TGPSCMainsPracticePage initialData={initialData} />} />
          <Route path="/appsc-prelims-practice" element={<APPSCPrelimsPracticePage initialData={initialData} />} />
          <Route path="/appsc-mains-practice" element={<APPSCMainsPracticePage initialData={initialData} />} />
          
          {/* Courses Route */}
          <Route path="/courses" element={<CoursesPage initialData={initialData} />} />
          
          {/* Current Affairs Routes */}
          <Route path="/current-affairs" element={<CurrentAffairsPage initialData={initialData} />} />
          <Route path="/current-affairs/upsc" element={<UPSCCurrentAffairsPage initialData={initialData} />} />
          <Route path="/current-affairs/tgpsc" element={<TGPSCCurrentAffairsPage initialData={initialData} />} />
          <Route path="/current-affairs/appsc" element={<APPSCCurrentAffairsPage initialData={initialData} />} />
          <Route path="/current-affairs/upsc/:dateParam" element={<UPSCCurrentAffairsDetailPage initialData={initialData} />} />
          <Route path="/current-affairs/tgpsc/:dateParam" element={<TGPSCCurrentAffairsDetailPage initialData={initialData} />} />
          <Route path="/current-affairs/appsc/:dateParam" element={<APPSCCurrentAffairsDetailPage initialData={initialData} />} />
          
          {/* Current Affairs Article Routes */}
                  <Route path="/current-affairs/upsc/:dateParam/:slug" element={<BlogPost isCurrentAffair={true} examType="upsc" initialData={initialData} />} />
        <Route path="/current-affairs/tgpsc/:dateParam/:slug" element={<BlogPost isCurrentAffair={true} examType="tgpsc" initialData={initialData} />} />
        <Route path="/current-affairs/appsc/:dateParam/:slug" element={<BlogPost isCurrentAffair={true} examType="appsc" initialData={initialData} />} />
          
          {/* Notes Routes */}
          <Route path="/notes" element={<BlogIndex />} />
          <Route path="/notes/:slug" element={<BlogPost initialData={initialData} />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          
          {/* Blog Routes */}
          <Route path="/blogs" element={<BlogsIndex />} />
          <Route path="/blogs/:slug" element={<BlogPost isBlog={true} initialData={initialData} />} />
          
          {/* Exam Specific Notes Routes */}
          <Route path="/upsc-notes" element={<CustomPageView isExamPage="upsc" />} />
          <Route path="/appsc-notes" element={<CustomPageView isExamPage="appsc" />} />
          <Route path="/tgpsc-notes" element={<CustomPageView isExamPage="tgpsc" />} />
          
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
          <Route path="/editor-debug" element={<EditorDebugTest />} />
          
          {/* Firebase Connection Test Route (for development) */}
          <Route path="/firebase-test" element={<FirebaseConnectionTest />} />
          
          {/* Legal Pages */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
          {/* Exam-specific PYQs Routes */}
          <Route path="/upsc-mains-pyqs" element={<Navigate to="/pyqs/mains/upsc" replace />} />
          <Route path="/tgpsc-mains-pyqs" element={<Navigate to="/pyqs/mains/tgpsc" replace />} />
          <Route path="/appsc-mains-pyqs" element={<Navigate to="/pyqs/mains/appsc" replace />} />
          
          {/* Custom Pages & Blog Posts at Root Level - Must be after all other routes */}
          <Route path="/:slug" element={<CustomPageView initialData={initialData} />} />
          
          {/* Catch-all route - MUST be last */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;