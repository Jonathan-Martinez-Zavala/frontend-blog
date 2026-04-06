import React from 'react';
import { Typography, Box, Card, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ListIcon from '@mui/icons-material/List';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ArticleIcon from '@mui/icons-material/Article';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const options: {
    title: string;
    description?: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }[] = [
      {
        title: 'Usuarios',
        description: 'Lista de usuarios que han creado una cuenta en la plataforma.',
        icon: <PeopleIcon />,
        onClick: () => navigate('/admin/users')
      },
      {
        title: 'Artículos',
        description: 'Redactar y publicar nuevo contenido para el blog.',
        icon: <ArticleIcon />,
        onClick: () => navigate('/admin/articles/create')
      },
      {
        title: 'Borradores',
        description: 'Vuelve a revisar y continuar publicando tus artículos no terminados.',
        icon: <DraftsIcon />,
        onClick: () => navigate('/admin/drafts')
      },
      // {
      //   title: 'Categorias',
      //   description: 'Administrar las categorías utilizadas para organizar el contenido del blog.',
      //   icon: <ListIcon />,
      //   onClick: () => navigate('/admin/categories')
      // },
      {
        title: 'Contacto',
        description: 'Configurar el contacto donde los visitantes pueden enviar mensajes.',
        icon: <RecentActorsIcon />,
        onClick: () => navigate('/admin/contact')
      }
    ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Administración
      </Typography>

      <Typography color="text.secondary">
        Panel de gestión (Solo administrador).
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {options.map((item) => (
          <Grid key={item.title}>
            <Card
              sx={{
                p: 3,
                width: 300,
                height: 200,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                border: '1px solid #DDD',
                boxShadow: 'none'
              }}
              onClick={item.onClick}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </Box>

              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const AdminPage = () => (
  <Layout>
    <Admin />
  </Layout>
);

export default AdminPage;
