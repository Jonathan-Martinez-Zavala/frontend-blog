import React, { useEffect, useState } from 'react';
import { Typography, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, TextField, CircularProgress, IconButton } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import BackButton from '../../components/BackButton';
import { getAll } from '../../firebase';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import EmailIconOutlined from '@mui/icons-material/EmailOutlined';

interface User {
    uid: string;
    displayName?: string;
    name?: string;
    email: string;
    photoURL?: string;
    role: string;
    id: string;
}

const UsuariosAdmin: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAll<User>('users');
                setUsers(usersData);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u) => {
        // No mostrar al usuario actual (tú)
        if (currentUser && u.uid === currentUser.uid) return false;

        const term = searchTerm.toLowerCase();
        const userName = u.displayName || u.name || u.email || '';
        const userEmail = u.email || '';

        return (
            userName.toLowerCase().includes(term) ||
            userEmail.toLowerCase().includes(term)
        );
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <BackButton />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Usuarios
                </Typography>
            </Box>

            {/** Buscador */}
            <TextField
                label="Buscar"
                variant="outlined"
                placeholder='Nombre o correo'
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2, width: '300px' }}
            />

            {/* Lista de usuarios */}
            <List>
                {isLoading ? (
                    <Loader />
                ) : filteredUsers.map((user, index) => {
                    const finalName = user.displayName || user.name || user.email || 'Sin nombre';
                    return (
                        <React.Fragment key={user.id}>
                            <ListItem sx={{ bgcolor: 'background.paper' }}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={user.photoURL || ''}
                                        alt={finalName}
                                    >
                                        {finalName.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={finalName}
                                    secondary={user.email}
                                />

                                <IconButton
                                    edge="end"
                                    aria-label="email"
                                    onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`, '_blank')}
                                    sx={{ color: 'primary.main' }}
                                >
                                    <EmailIconOutlined />
                                </IconButton>
                            </ListItem>
                            {index < filteredUsers.length - 1 && <Divider />}
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
};

const UsuariosAdminPage = () => (
    <Layout>
        <UsuariosAdmin />
    </Layout>
);

export default UsuariosAdminPage;