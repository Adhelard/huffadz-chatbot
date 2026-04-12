// Di file: /src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ConversationPage from './pages/ConversationPage'
import AuthPage from './pages/AuthPage.jsx'
import { HelmetProvider } from 'react-helmet-async'; // <-- Ini sudah benar

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👇 TAMBAHKAN INI 👇 */}
    <HelmetProvider> 
      <BrowserRouter>
        <Routes>
          {/* Arahkan root path / langsung ke ConversationPage (Chat) */}
          <Route path="/" element={<ConversationPage />} /> 
          
          {/* Halaman Auth gabungan untuk Login/Register */}
          <Route path="/auth" element={<AuthPage />} /> 
          
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
    {/* 👆 TAMBAHKAN INI 👆 */}
  </StrictMode>,
)