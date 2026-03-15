import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Header: React.FC = () => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
            <RocketLaunchIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
            >
              Rico<Box component="span" sx={{ color: 'primary.main' }}>Blog</Box>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
