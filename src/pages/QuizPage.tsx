import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion, { Question } from '../components/quiz/QuizQuestion';
import QuizNavigation from '../components/quiz/QuizNavigation';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResult from '../components/quiz/QuizResult';
import { Quiz } from '../components/quiz/QuizList';

// Sample questions data
const quizData: Record<string, { quiz: Quiz; questions: Question[] }> = {
  'general-knowledge': {
    quiz: {
      id: 'general-knowledge',
      title: 'General Knowledge',
      description: 'Test your knowledge on various general topics',
      totalQuestions: 10,
      timeInMinutes: 15,
      difficulty: 'easy',
    },
    questions: [
      {
        id: 1,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
      },
      {
        id: 4,
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2,
      },
      {
        id: 6,
        question: 'Which country is home to the kangaroo?',
        options: ['New Zealand', 'South Africa', 'Australia', 'Brazil'],
        correctAnswer: 2,
      },
      {
        id: 7,
        question: 'What is the largest mammal in the world?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: 'In which year did World War II end?',
        options: ['1943', '1945', '1947', '1950'],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: 'What is the main ingredient in guacamole?',
        options: ['Avocado', 'Tomato', 'Onion', 'Lime'],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: 'Which famous scientist developed the theory of relativity?',
        options: ['Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Stephen Hawking'],
        correctAnswer: 2,
      },
    ],
  },
  'science': {
    quiz: {
      id: 'science',
      title: 'Science Quiz',
      description: 'Challenge yourself with questions about science and technology',
      totalQuestions: 15,
      timeInMinutes: 20,
      difficulty: 'medium',
    },
    questions: [
      {
        id: 1,
        question: 'What is the chemical symbol for water?',
        options: ['WA', 'H2O', 'HO2', 'W'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'Which of these is NOT a type of rock?',
        options: ['Igneous', 'Sedimentary', 'Metamorphic', 'Metallic'],
        correctAnswer: 3,
      },
      {
        id: 3,
        question: 'What is the smallest unit of matter?',
        options: ['Atom', 'Molecule', 'Cell', 'Electron'],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: 'What force keeps planets in orbit around the sun?',
        options: ['Magnetic force', 'Nuclear force', 'Gravity', 'Centrifugal force'],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: 'What is the speed of light in a vacuum?',
        options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
        correctAnswer: 0,
      },
      // Add more science questions as needed to reach 15 questions
      {
        id: 6,
        question: 'Which of the following is NOT a state of matter?',
        options: ['Solid', 'Liquid', 'Gas', 'Energy'],
        correctAnswer: 3,
      },
      {
        id: 7,
        question: 'What is the process by which plants make their own food?',
        options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
        correctAnswer: 1,
      },
      {
        id: 8,
        question: 'What is the largest organ in the human body?',
        options: ['Heart', 'Liver', 'Skin', 'Brain'],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: 'Which element has the chemical symbol "Fe"?',
        options: ['Iron', 'Fluorine', 'Francium', 'Fermium'],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: 'What is the unit of electrical resistance?',
        options: ['Volt', 'Watt', 'Ampere', 'Ohm'],
        correctAnswer: 3,
      },
      {
        id: 11,
        question: 'Which planet has the most moons?',
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        correctAnswer: 1,
      },
      {
        id: 12,
        question: 'What is the hardest natural substance on Earth?',
        options: ['Platinum', 'Diamond', 'Titanium', 'Quartz'],
        correctAnswer: 1,
      },
      {
        id: 13,
        question: 'What is the name of the process by which liquid becomes vapor?',
        options: ['Condensation', 'Evaporation', 'Sublimation', 'Precipitation'],
        correctAnswer: 1,
      },
      {
        id: 14,
        question: 'Which of these is NOT a primary color of light?',
        options: ['Red', 'Green', 'Blue', 'Yellow'],
        correctAnswer: 3,
      },
      {
        id: 15,
        question: 'What is the study of fossils called?',
        options: ['Archaeology', 'Paleontology', 'Geology', 'Anthropology'],
        correctAnswer: 1,
      },
    ],
  },
  'history': {
    quiz: {
      id: 'history',
      title: 'History Quiz',
      description: 'Explore historical events and figures through this challenging quiz',
      totalQuestions: 12,
      timeInMinutes: 18,
      difficulty: 'hard',
    },
    questions: [
      {
        id: 1,
        question: 'In which year did Christopher Columbus first reach the Americas?',
        options: ['1492', '1498', '1512', '1520'],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Who was the first Emperor of Rome?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Constantine'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'The French Revolution began in which year?',
        options: ['1769', '1789', '1799', '1809'],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: 'Which ancient civilization built the Machu Picchu complex in Peru?',
        options: ['Maya', 'Aztec', 'Inca', 'Olmec'],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: 'Who was the first female Prime Minister of the United Kingdom?',
        options: ['Queen Victoria', 'Margaret Thatcher', 'Theresa May', 'Queen Elizabeth II'],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: 'The Battle of Hastings took place in which year?',
        options: ['1066', '1086', '1166', '1186'],
        correctAnswer: 0,
      },
      {
        id: 7,
        question: 'Which country was NOT part of the Allied Powers during World War II?',
        options: ['United States', 'Soviet Union', 'Italy', 'United Kingdom'],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: 'Who wrote "The Communist Manifesto"?',
        options: ['Vladimir Lenin', 'Joseph Stalin', 'Karl Marx and Friedrich Engels', 'Leon Trotsky'],
        correctAnswer: 2,
      },
      {
        id: 9,
        question: 'The ancient city of Byzantium later became known as:',
        options: ['Athens', 'Rome', 'Constantinople', 'Alexandria'],
        correctAnswer: 2,
      },
      {
        id: 10,
        question: 'Which of these countries was NOT part of the Soviet Union?',
        options: ['Ukraine', 'Belarus', 'Romania', 'Kazakhstan'],
        correctAnswer: 2,
      },
      {
        id: 11,
        question: 'Who was the leader of the Soviet Union during the Cuban Missile Crisis?',
        options: ['Joseph Stalin', 'Nikita Khrushchev', 'Leonid Brezhnev', 'Mikhail Gorbachev'],
        correctAnswer: 1,
      },
      {
        id: 12,
        question: 'The Magna Carta was signed during the reign of which English king?',
        options: ['King Henry VIII', 'King Richard I', 'King John', 'King Edward I'],
        correctAnswer: 2,
      },
    ],
  },
};

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [currentQuizData, setCurrentQuizData] = useState<{ quiz: Quiz; questions: Question[] } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Load saved state from localStorage on component mount
  useEffect(() => {
    if (quizId) {
      const savedState = localStorage.getItem(`quiz_${quizId}_state`);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setQuizStarted(parsedState.quizStarted);
        setCurrentQuestion(parsedState.currentQuestion);
        setUserAnswers(parsedState.userAnswers);
        setQuizCompleted(parsedState.quizCompleted);
        setStartTime(parsedState.startTime);
      }
    }
  }, [quizId]);
  
  useEffect(() => {
    if (quizId && quizData[quizId]) {
      setCurrentQuizData(quizData[quizId]);
      
      // Initialize user answers array with nulls if no saved state
      if (!localStorage.getItem(`quiz_${quizId}_state`)) {
        setUserAnswers(Array(quizData[quizId].questions.length).fill(null));
      }
    } else {
      // Redirect to quizzes page if quiz not found
      navigate('/quizzes');
    }
  }, [quizId, navigate]);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (quizId && quizStarted) {
      const stateToSave = {
        quizStarted,
        currentQuestion,
        userAnswers,
        quizCompleted,
        startTime
      };
      localStorage.setItem(`quiz_${quizId}_state`, JSON.stringify(stateToSave));
    }
  }, [quizId, quizStarted, currentQuestion, userAnswers, quizCompleted, startTime]);
  
  const handleStartQuiz = () => {
    const now = Date.now();
    setQuizStarted(true);
    setCurrentQuestion(0);
    setStartTime(now);
  };
  
  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };
  
  const handleNavigate = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };
  
  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    
    // Calculate time taken
    if (currentQuizData && startTime) {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimeTaken(elapsedSeconds);
      
      // Clear saved state
      if (quizId) {
        localStorage.removeItem(`quiz_${quizId}_state`);
      }
    }
  };
  
  const handleTimeUp = () => {
    setQuizCompleted(true);
    
    // Calculate time taken
    if (currentQuizData) {
      setTimeTaken(currentQuizData.quiz.timeInMinutes * 60);
      
      // Clear saved state
      if (quizId) {
        localStorage.removeItem(`quiz_${quizId}_state`);
      }
    }
  };
  
  // Calculate remaining time based on start time
  const getRemainingTime = (): number => {
    if (!currentQuizData || !startTime) return 0;
    
    const totalTimeInMs = currentQuizData.quiz.timeInMinutes * 60 * 1000;
    const elapsedTimeInMs = Date.now() - startTime;
    const remainingTimeInMs = Math.max(0, totalTimeInMs - elapsedTimeInMs);
    
    return Math.ceil(remainingTimeInMs / 1000);
  };
  
  if (!currentQuizData) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (quizCompleted) {
    return (
      <div className="bg-gray-50 min-h-screen pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuizResult
            questions={currentQuizData.questions}
            userAnswers={userAnswers}
            timeTaken={timeTaken}
            quizTitle={currentQuizData.quiz.title}
            quizId={quizId || ''}
          />
        </div>
      </div>
    );
  }
  
  if (!quizStarted) {
    return (
      <div className="bg-gray-50 min-h-screen pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">{currentQuizData.quiz.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">{currentQuizData.quiz.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Total Questions: {currentQuizData.quiz.totalQuestions}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Time Limit: {currentQuizData.quiz.timeInMinutes} minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Instructions</h3>
                <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                  <li>Read each question carefully before answering.</li>
                  <li>You can navigate between questions using the navigation panel.</li>
                  <li>The timer will start as soon as you begin the quiz.</li>
                  <li>Your quiz will be automatically submitted when the time is up.</li>
                  <li>You can review and change your answers before submitting.</li>
                </ul>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{currentQuizData.quiz.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuizQuestion
              question={currentQuizData.questions[currentQuestion]}
              selectedAnswer={userAnswers[currentQuestion]}
              onSelectAnswer={handleSelectAnswer}
              questionNumber={currentQuestion + 1}
              totalQuestions={currentQuizData.questions.length}
            />
          </div>
          
          <div className="space-y-6">
            <QuizTimer
              remainingSeconds={getRemainingTime()}
              totalSeconds={currentQuizData.quiz.timeInMinutes * 60}
              onTimeUp={handleTimeUp}
            />
            
            <QuizNavigation
              currentQuestion={currentQuestion}
              totalQuestions={currentQuizData.questions.length}
              answeredQuestions={userAnswers}
              onNavigate={handleNavigate}
              onSubmit={handleSubmitQuiz}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 