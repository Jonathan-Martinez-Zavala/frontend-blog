import React, { type ReactNode } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 6,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} RicoBlog.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
