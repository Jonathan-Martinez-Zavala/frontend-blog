import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';

import googleIcon from '../../assets/google.svg';
import collabImage from '../../assets/Collab-bro.png';

import {
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { auth } from '../../firebase';

const Login: React.FC = () => {
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log('Login con Google correcto');
    } catch (error) {
      console.error('Error con Google login', error);
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        width: '100vw',
        m: 0,
        p: 0,
        bgcolor: 'background.default'
      }}
    >

      {/* Lado izquierdo - Ilustración */}
      <Grid
        size={{ md: 6 }}
        sx={{
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Box
          sx={{
            p: 4,
            height: '100%',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${collabImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              maxWidth: '500px',
              height: '500px'
            }}
          />
          <Typography variant="h5" fontWeight="bold" textAlign="center" color="primary">
            “El cambio es inevitable, pero el crecimiento es una elección.”
          </Typography>

          <Typography variant="body1" color="text.secondary">
            — John C. Maxwell
          </Typography>
        </Box>
      </Grid>

      {/* Lado derecho - Inicio de sesión */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            height: '100%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '400px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            <Box>
              <Typography variant="h2" fontWeight="light" letterSpacing="3px" gutterBottom>
                <Box component="span" color="primary.main">JC</Box>
                <Box component="span" color="secondary.main">|</Box>
                <Box component="span" color="primary.main">RR</Box>
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Bienvenido
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Inicia sesión para continuar y ver las últimas publicaciones.
              </Typography>
            </Box>

            <Button
              size="large"
              fullWidth
              sx={{ bgcolor: 'background.paper' }}
              onClick={handleGoogleLogin}
              startIcon={<img src={googleIcon} alt="Google" style={{ width: 20, height: 20 }}
              />}
            >
              Continuar con Google
            </Button>

            <Typography variant="caption" color="text.secondary">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad.
            </Typography>
          </Box>
        </Box>
      </Grid>

    </Grid>
  );
};

export default Login;