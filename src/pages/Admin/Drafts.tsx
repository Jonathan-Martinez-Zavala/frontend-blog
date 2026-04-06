import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import { getAll } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Loader from '../../components/Loader';

const Drafts: React.FC = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      const response = await getAll<any>('articles');
      const myDrafts = response.filter(a => a.status === 'draft' && (!a.authorId || a.authorId === user?.uid));
      myDrafts.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setDrafts(myDrafts);
      setIsLoading(false);
    };
    if (user) {
      fetchDrafts();
    }
  }, [user]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, pt: { xs: 2, md: 5 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Mis Borradores
      </Typography>
      
      {isLoading ? (
        <Loader />
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)', bgcolor: 'background.paper' }}>
          <List disablePadding>
            {drafts.length === 0 && (
              <ListItem>
                <ListItemText primary="No tienes borradores pendientes." sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }} />
              </ListItem>
            )}
            {drafts.map((draft, index) => (
              <React.Fragment key={draft.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary={draft.title} 
                    secondary={`Categoría: ${draft.categoryName} • Creado: ${draft.createdAt?.seconds ? new Date(draft.createdAt.seconds * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Reciente'}`} 
                    primaryTypographyProps={{ fontWeight: 600, variant: 'subtitle1' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => navigate(`/admin/articles/edit/${draft.id}`)} title="Continuar editando">
                      <EditOutlinedIcon color="primary" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < drafts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
};

const DraftsPage = () => (
  <Layout>
    <Drafts />
  </Layout>
);

export default DraftsPage;
