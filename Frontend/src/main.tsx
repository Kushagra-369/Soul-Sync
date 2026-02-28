import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from "./Context/ThemeContext";
import App from './App.tsx'
import { AuthProvider } from './Components/Context/AuthContext';

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
