import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppStateProvider } from './state/AppState';
import { MotionProvider } from './components/MotionProvider';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing from index.html');

createRoot(root).render(
  <StrictMode>
    <AppStateProvider>
      <MotionProvider>
        <App />
      </MotionProvider>
    </AppStateProvider>
  </StrictMode>,
);
