import React from 'react';
import { Typography, Box, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                p: 4,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Página no encontrada
            </Typography>

            <Typography color="text.secondary">
                La página que intentas visitar no existe o fue movida.
            </Typography>

            <Button
                variant='contained'
                sx={{ mt: 4 }}
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
            >
                Regresar
            </Button>
        </Box>
    );
};

export default NotFound;