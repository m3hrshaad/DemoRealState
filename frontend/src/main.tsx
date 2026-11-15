import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/vazirmatn';
import './index.css';
import App from './App';
import { SiteProvider } from './components/SiteProvider';
import { ToastProvider } from './components/ui/Toast';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <SiteProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SiteProvider>
  </BrowserRouter>,
);
