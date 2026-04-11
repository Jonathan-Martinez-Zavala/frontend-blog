import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Menu, MenuItem, ListItemIcon } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import BackButton from '../../components/BackButton';
import { getAll } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Loader from '../../components/Loader';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const Drafts: React.FC = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, articleId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticleId(articleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedArticleId(null);
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticleId) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar este borrador?')) {
      try {
        await deleteDoc(doc(db, 'articles', selectedArticleId));
        setDrafts(prev => prev.filter(a => a.id !== selectedArticleId));
        handleMenuClose();
      } catch (error) {
        console.error("Error al eliminar el borrador:", error);
        alert("Hubo un error al intentar eliminar el borrador.");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, pt: { xs: 2, md: 5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <BackButton />
        <Typography variant="h5" fontWeight="bold">
          Mis Borradores
        </Typography>
      </Box>
      
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
                    <IconButton edge="end" onClick={(e) => handleMenuOpen(e, draft.id)} title="Opciones">
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < drafts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}

      {/* Menú de Opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={() => { navigate(`/admin/articles/edit/${selectedArticleId}`); handleMenuClose(); }}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteArticle} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const DraftsPage = () => (
  <Layout>
    <Drafts />
  </Layout>
);

export default DraftsPage;
