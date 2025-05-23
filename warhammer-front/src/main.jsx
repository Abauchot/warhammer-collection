import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// import pages
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CreateFigurine from './pages/createFigurine.jsx'
import CreateFaction from './pages/CreateFaction.jsx'
import CreateArmy from './pages/CreateArmy.jsx'
import UserFigurines from './pages/userFigurines.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ajouter-figurine" element={<CreateFigurine />} />
        <Route path="/ajouter-faction" element={<CreateFaction />} />
        <Route path="/ajouter-armee" element={<CreateArmy />} />
        <Route path="/mes-figurines" element={<UserFigurines />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
