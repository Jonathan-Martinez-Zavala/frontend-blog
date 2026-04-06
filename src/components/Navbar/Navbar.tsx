import React from 'react';
import { Box, Container, Link, Stack } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { label: 'Inicio', path: '/home' },
  { label: 'Categorías', path: '/categories' },
  { label: 'Contacto', path: '/contact' },
  { label: 'Acerca de', path: '/about' },
  { label: 'Administrar', path: '/admin', private: true },
];

const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  
  const visibleItems = menuItems.filter(item => !item.private || (user && role === 'admin'));

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          spacing={4}
          sx={{
            height: 56,
            alignItems: 'center',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {visibleItems.map((item) => (
            <Link
              key={item.label}
              component={NavLink}
              to={item.path}
              underline="none"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.9375rem',
                whiteSpace: 'nowrap',
                transition: '0.2s',
                position: 'relative',
                '&:hover, &.active': {
                  color: 'primary.main',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -18,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  bgcolor: 'primary.main',
                  transform: 'scaleX(0)',
                  transition: '0.2s',
                },
                '&:hover::after, &.active::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;
