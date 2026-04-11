import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import BackButton from '../../components/BackButton';
import { getAll, updateDocument, db } from '../../firebase';
import { collection, doc, addDoc, deleteDoc } from 'firebase/firestore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import Loader from '../../components/Loader';

interface ContactInfo {
  id: string;
  email: string;
  name?: string;
}

const ContactAdmin: React.FC = () => {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contactToDeleteId, setContactToDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await getAll<ContactInfo>('contacts');
      setContacts(data);
    } catch (error) {
      console.error("Error al obtener contactos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenDialog = (contact?: ContactInfo) => {
    if (contact) {
      setSelectedContact(contact);
      setName(contact.name || '');
      setEmail(contact.email);
    } else {
      setSelectedContact(null);
      setName('');
      setEmail('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContact(null);
  };

  const handleSubmit = async () => {
    if (!email) return;

    try {
      if (selectedContact) {
        // Edit
        await updateDocument('contacts', selectedContact.id, { name, email });
      } else {
        // Add
        await addDoc(collection(db, 'contacts'), { name, email });
      }
      fetchContacts();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar contacto:", error);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setContactToDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setContactToDeleteId(null);
  };

  const handleDelete = async () => {
    if (!contactToDeleteId) return;
    try {
      await deleteDoc(doc(db, 'contacts', contactToDeleteId));
      setContacts(prev => prev.filter(c => c.id !== contactToDeleteId));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, pt: { xs: 2, md: 5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BackButton />
          <Typography variant="h5" fontWeight="bold">
            Administrar Contactos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar
        </Button>
      </Box>

      {isLoading ? (
        <Loader />
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          <List disablePadding>
            {contacts.length === 0 && (
              <ListItem sx={{ py: 4 }}>
                <ListItemText primary="No hay contactos registrados." sx={{ textAlign: 'center', color: 'text.secondary' }} />
              </ListItem>
            )}
            {contacts.map((contact, index) => (
              <React.Fragment key={contact.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={contact.name || 'Sin nombre'}
                    secondary={contact.email}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenDialog(contact)} sx={{ mr: 1 }}>
                      <EditOutlinedIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(contact.id)} color="error">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < contacts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}

      {/* Dialogo Agregar/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">
          {selectedContact ? 'Editar Contacto' : 'Nuevo Contacto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre (Ej: Soporte, Info)"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Correo Electrónico"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!email}>
            {selectedContact ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo Confirmar Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle fontWeight="bold">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este contacto? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ContactAdminPage = () => (
  <Layout>
    <ContactAdmin />
  </Layout>
);

export default ContactAdminPage;
