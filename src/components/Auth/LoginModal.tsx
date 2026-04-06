import React, { useState } from 'react';
import { Modal, Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import googleIcon from '../../assets/google.svg';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose(); // Cerrar tras éxito
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={{ 
        width: { xs: '90%', sm: 400 }, 
        bgcolor: 'background.paper', 
        borderRadius: 3, 
        boxShadow: 24, 
        p: 4, 
        position: 'relative',
        textAlign: 'center'
      }}>
        <IconButton 
          sx={{ position: 'absolute', right: 8, top: 8 }} 
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="login-modal-title" variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Únete a la conversación
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Inicia sesión para reaccionar, comentar y compartir contenido con la comunidad.
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleLogin}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <img src={googleIcon} alt="Google" style={{ width: 20 }} />}
          sx={{ 
            py: 1.5, 
            borderRadius: 2, 
            textTransform: 'none', 
            fontSize: '1rem',
            fontWeight: 600,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'rgba(0,0,0,0.02)'
            }
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
