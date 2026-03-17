import React, { useEffect, useState } from 'react';
import { Typography, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, TextField, CircularProgress } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import BackButton from '../../components/BackButton';
import { getAll } from '../../firebase';

interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    role: string;
    id: string;
}

const UsuariosAdmin: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await getAll<User>('users');
            setUsers(usersData);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();

        return (
            user.displayName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                    </Box>
                ) : filteredUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                        <ListItem sx={{ bgcolor: 'background.paper' }}>
                            <ListItemAvatar>
                                <Avatar
                                    src={user.photoURL}
                                    alt={user.displayName}
                                />
                            </ListItemAvatar>

                            <ListItemText
                                primary={user.displayName}
                                secondary={user.email}
                            />
                        </ListItem>
                        {index < filteredUsers.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
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