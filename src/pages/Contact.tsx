import React, { useEffect, useState } from 'react';
import { Typography, Box, Container, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Stack, IconButton } from '@mui/material';
import Layout from '../components/Layout/Layout';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { getAll } from '../firebase';
import Loader from '../components/Loader';

interface ContactInfo {
  id: string;
  email: string;
  name?: string;
}

const Contact: React.FC = () => {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getAll<ContactInfo>('contacts');
        setContacts(data);
      } catch (error) {
        console.error("Error al obtener contactos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Contacto
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Para resolver dudas o comunicarte directamente conmigo, puedes utilizar los siguientes medios oficiales:
        </Typography>
      </Box>

      {isLoading ? (
        <Loader />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            {contacts.length === 0 ? (
              <ListItem sx={{ py: 4 }}>
                <ListItemText 
                  primary="No hay canales de contacto disponibles en este momento." 
                  sx={{ textAlign: 'center', color: 'text.secondary' }} 
                />
              </ListItem>
            ) : (
              contacts.map((contact, index) => (
                <React.Fragment key={contact.id}>
                  <ListItem 
                    sx={{ py: 3, px: 3 }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        color="primary" 
                        onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`, '_blank')}
                        title="Enviar correo"
                      >
                        <EmailOutlinedIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <EmailOutlinedIcon color="primary" sx={{ fontSize: 30 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={contact.name || 'Correo Electrónico'}
                      secondary={contact.email}
                      primaryTypographyProps={{ fontWeight: 600, variant: 'subtitle1' }}
                      secondaryTypographyProps={{ variant: 'body1', sx: { mt: 0.5 } }}
                    />
                  </ListItem>
                  {index < contacts.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      )}

      <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Información adicional
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Se intenta responder a todos los mensajes en un plazo de 24 a 48 horas hábiles. Gracias por tu paciencia.
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
};

const ContactPage = () => (
  <Layout>
    <Contact />
  </Layout>
);

export default ContactPage;
