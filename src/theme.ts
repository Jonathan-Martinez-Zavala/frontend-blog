import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F3A5F', // Azul
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C8A75D', // Dorado
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F3F4F6', // Gris claro
      paper: '#FFFFFF',    // Blanco
    },
    text: {
      primary: '#1F3A5F',   // Azul para títulos
      secondary: '#6B7280', // Gris para texto secundario
    },
    grey: {
      50: '#F3F4F6',
      500: '#6B7280',
    }
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#1F3A5F' },
    h2: { fontWeight: 700, color: '#1F3A5F' },
    h3: { fontWeight: 600, color: '#1F3A5F' },
    h4: { fontWeight: 700, color: '#1F3A5F' },
    h5: { fontWeight: 700, color: '#1F3A5F' },
    h6: { fontWeight: 700, color: '#1F3A5F' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#C8A75D', // Dorado al hacer hover
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1F3A5F',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          borderBottom: '1px solid #F3F4F6',
        },
      },
    },
  },
});

export default theme;
