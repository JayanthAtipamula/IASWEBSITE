import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { setupStagewise } from './utils/stagewise';

// Initialize Stagewise toolbar in development mode
setupStagewise();

// Get initial data from server-side rendering
const initialData = (window as any).__INITIAL_DATA__;

const container = document.getElementById('root')!;

// Always use hydrateRoot in production when we have server-rendered content
if (container.innerHTML.trim() && container.innerHTML !== '<!--ssr-outlet-->') {
  // Hydrate server-rendered content
  hydrateRoot(container, 
    <StrictMode>
      <BrowserRouter>
        <App initialData={initialData} />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  // Fallback to client-side rendering for development or when SSR fails
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter>
        <App initialData={initialData} />
      </BrowserRouter>
    </StrictMode>
  );
}
