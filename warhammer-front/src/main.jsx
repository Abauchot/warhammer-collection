import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/cinzel';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// import pages
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CreateFigurine from './pages/createFigurine.jsx'
import CreateFaction from './pages/CreateFaction.jsx'
import CreateArmy from './pages/CreateArmy.jsx'
import UserFigurines from './pages/userFigurines.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
