import React from 'react';
import { Typography, Box } from '@mui/material';
import Layout from '../components/Layout/Layout';

const Contact: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Contacto</Typography>
      <Typography color="text.secondary">Ponte en contacto con nosotros.</Typography>
    </Box>
  );
};

const ContactPage = () => (
  <Layout>
    <Contact />
  </Layout>
);

export default ContactPage;
