import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider
} from '@mui/material';

import googleIcon from '../../assets/google.svg';
import collabImage from '../../assets/Collab-bro.png';

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { auth } from '../../firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const provider = new GoogleAuthProvider();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login correcto');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

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
        p: 0
      }}
    >

      {/* Lado izquierdo */}
      <Grid
        size={{ md: 6, lg: 6 }}
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
            gap: '10px'
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
          <Typography variant="body1" fontWeight="bold" textAlign="center">
            “El cambio es inevitable, pero el crecimiento es una elección.”
          </Typography>

          <Typography variant="body2" color="text.secondary">
            — John C. Maxwell
          </Typography>
        </Box>
      </Grid>

      {/* Lado derecho */}
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <Box
          sx={{
            height: '100%',
            p: 4,
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <Box
            sx={{
              backgroundImage: `url(${collabImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              maxWidth: '200px',
              height: '200px',
            }}
          /> */}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >

            <Typography variant="h5" fontWeight="bold">
              Inicio de sesión
            </Typography>

            <TextField
              label="Correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
              Iniciar sesión
            </Button>

            <Divider>o</Divider>

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

          </Box>
        </Box>
      </Grid>

    </Grid>
  );
};

export default Login;