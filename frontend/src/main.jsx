import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './Context/UserContext'; // Corrected import (assuming the file is in './Context')
import CaptainContext from './Context/CaptainContext';
import SocketProvider, { useSocket } from './Context/SocketContext';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CaptainContext>
        <UserContext>
          <SocketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SocketProvider>
        </UserContext>
      </CaptainContext>
    </ErrorBoundary>
  </StrictMode>
);
