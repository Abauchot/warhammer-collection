import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme/theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Collection from './pages/Collection';
import CreateFaction from './pages/CreateFaction';
import CreateArmy from './pages/CreateArmy';
import Factions from './pages/Factions';
import Armies from './pages/Armies';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/collection"
              element={
                <ProtectedRoute>
                  <Collection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-faction"
              element={
                <ProtectedRoute>
                  <CreateFaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-army"
              element={
                <ProtectedRoute>
                  <CreateArmy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/factions"
              element={
                <ProtectedRoute>
                  <Factions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/armies"
              element={
                <ProtectedRoute>
                  <Armies />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
