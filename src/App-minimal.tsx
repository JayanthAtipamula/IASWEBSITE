import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<div>Welcome to SSR! Server Side Rendering is working!</div>} />
        <Route path="/about" element={<div>About Page - SSR Working</div>} />
        <Route path="*" element={<div>404 - Page not found</div>} />
      </Routes>
    </div>
  );
};

export default App;