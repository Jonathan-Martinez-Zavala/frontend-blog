import React from 'react';
import { Box, Container, Link, Stack } from '@mui/material';

const menuItems = [
  { label: 'Inicio', href: '' },
];

const Navbar: React.FC = () => {
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
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              underline="none"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.9375rem',
                whiteSpace: 'nowrap',
                transition: '0.2s',
                position: 'relative',
                '&:hover': {
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
                '&:hover::after': {
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
