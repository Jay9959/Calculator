import './index.css'
import React from 'react';
import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Calculator from './componet/calculator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Calculator />
  </StrictMode>,
)