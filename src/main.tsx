import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-center" toastOptions={{
            style: { borderRadius: '14px', fontFamily: 'Plus Jakarta Sans', fontSize: '14px', fontWeight: '500', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
            success: { iconTheme: { primary: '#1d3a8a', secondary: '#fff' } },
            duration: 2500,
          }} />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
