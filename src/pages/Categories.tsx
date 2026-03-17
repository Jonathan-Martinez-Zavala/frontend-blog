import React from 'react';
import { Typography, Box, Card } from '@mui/material';
import Layout from '../components/Layout/Layout';

const Categories: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Categorías</Typography>
      <Typography color="text.secondary">Explora artículos por categoría.</Typography>
      <Box sx={{ mt: 4 }}>
      </Box>
    </Box>
  );
};

const CategoriesPage = () => (
  <Layout>
    <Categories />
  </Layout>
);

export default CategoriesPage;