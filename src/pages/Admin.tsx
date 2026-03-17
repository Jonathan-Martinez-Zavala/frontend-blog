import React from 'react';
import { Typography, Box } from '@mui/material';

const Admin: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Administración</Typography>
      <Typography color="text.secondary">Panel de gestión de contenidos (Solo administradores).</Typography>
    </Box>
  );
};

export default Admin;
