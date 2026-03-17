import React from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../components/Layout/Layout';

const Home: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Inicio</Typography>
      <Typography color="text.secondary">Bienvenido a la página principal del blog.</Typography>
    </Box>
  );
};

const HomePage = () => (
  <Layout>
    <Home />
  </Layout>
);

export default HomePage;
