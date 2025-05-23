import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37', // Gold
      light: '#f7d571',
      dark: '#a17f00',
    },
    secondary: {
      main: '#8b0000', // Dark Red
      light: '#bc2f2f',
      dark: '#5c0000',
    },
    background: {
      default: '#1a1a1a',
      paper: '#262626',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 25px',
          border: '2px solid',
          '&:hover': {
            backgroundColor: '#d4af37',
            color: '#000000',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #d4af37',
        },
      },
    },
  },
}); 