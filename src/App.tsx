import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Resources from './components/Resources';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuizListPage from './pages/QuizListPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <Router>
      <div className="relative">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Resources />
              <Testimonials />
              <FAQ />
              <Contact />
            </main>
          } />
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;