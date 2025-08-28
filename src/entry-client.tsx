import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { setupStagewise } from './utils/stagewise';

// Initialize Stagewise toolbar in development mode
setupStagewise();

// Hydrate the app for SSR
const container = document.getElementById('root');
if (container) {
  // Get initial data from SSR if available
  const initialData = (window as any).__INITIAL_DATA__;
  
  hydrateRoot(
    container,
    <StrictMode>
      <BrowserRouter>
        <App initialData={initialData} />
      </BrowserRouter>
    </StrictMode>
  );
}