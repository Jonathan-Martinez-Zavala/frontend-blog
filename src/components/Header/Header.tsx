import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Avatar, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Header: React.FC = () => {
  const { user, logout, loginWithGoogle } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
            <Typography variant="h5" fontWeight="light" letterSpacing="3px" gutterBottom>
              <Box component="span" color="primary.main">JC</Box>
              <Box component="span" color="secondary.main">|</Box>
              <Box component="span" color="primary.main">RR</Box>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Cuenta">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.displayName || ''} src={user.photoURL || ''} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{user.displayName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); logout(); }}>
                    <Typography textAlign="center">Cerrar Sesión</Typography>
                    <LogoutIcon sx={{ ml: 1, fontSize: 20 }} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={loginWithGoogle}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
