import React from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../components/Layout/Layout';

const About: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Acerca de</Typography>
      <Typography color="text.secondary">Conoce más sobre este blog y su misión.</Typography>
    </Box>
  );
};

const Aboutpage = () => (
  <Layout>
    <About />
  </Layout>
)

export default Aboutpage;
