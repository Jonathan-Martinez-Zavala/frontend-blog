import React from 'react';
import { Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Inicio</Typography>
      <Typography color="text.secondary">Bienvenido a la página principal del blog.</Typography>
    </Box>
  );
};

export default Home;
