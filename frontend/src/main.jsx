import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './Context/UserContext'; // Corrected import (assuming the file is in './Context')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext> {/* Wrapping your app with the UserContext provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContext>
  </StrictMode>
);
