import React from 'react';
import { Typography, Box } from '@mui/material';

const Contact: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Contacto</Typography>
      <Typography color="text.secondary">Ponte en contacto con nosotros.</Typography>
    </Box>
  );
};

export default Contact;
