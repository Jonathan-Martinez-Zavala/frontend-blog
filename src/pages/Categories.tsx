import React from 'react';
import { Typography, Box } from '@mui/material';

const Categories: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Categorías</Typography>
      <Typography color="text.secondary">Explora nuestros artículos por categoría.</Typography>
    </Box>
  );
};

export default Categories;
