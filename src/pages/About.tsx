import React from 'react';
import { Typography, Box, Container, Grid, Card, CardContent, Avatar } from '@mui/material';
import Layout from '../components/Layout/Layout';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const About: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          borderRadius: 4,
          mb: 6,
          background:
            'linear-gradient(rgba(31, 58, 95, 0.82), rgba(31, 58, 95, 0.45)), url("/about_hero_background_1775946472367.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.75rem' },
            }}
          >
            Propósito
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              maxWidth: '700px',
              mx: 'auto',
              color: 'white',
              lineHeight: 1.6,
            }}
          >
            Plataforma dedicada a la difusión de conocimiento, el análisis de ideas y el
            registro de vivencias que enriquecen el pensamiento colectivo.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Main Purpose Section */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Objetivo Central
            </Typography>

            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}
            >
              Este blog existe como un recurso orientado a la democratización del
              conocimiento y la libre circulación de ideas. El espacio está diseñado para
              facilitar la lectura reflexiva y la exploración de temas que abarcan desde el
              desarrollo personal hasta el análisis social.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}
            >
              El centro de esta iniciativa radica en la creencia de que cada experiencia
              documentada posee el potencial de inspirar o guiar a otros. Por ello, se
              prioriza la claridad, la autenticidad y el valor intelectual en cada
              publicación.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: 4,
                bgcolor: 'rgba(31, 58, 95, 0.03)',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Misión
              </Typography>

              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontSize: '1.1rem', lineHeight: 1.6, }}
              >
                Proporcionar una estructura digital donde la información se convierta en
                aprendizaje y los relatos individuales en lecciones compartidas.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Areas of Focus */}
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Ejes del Contenido
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: 10 }}
        >
          {[
            {
              title: 'Intercambio de Ideas',
              desc: 'Difusión de conceptos innovadores y teorías que invitan al análisis crítico y al debate intelectual.',
              icon: <LightbulbCircleIcon fontSize="large" />,
              color: '#1F3A5F',
            },
            {
              title: 'Registro de Experiencias',
              desc: 'Documentación de vivencias reales con el fin de extraer aprendizajes aplicables a diversos contextos.',
              icon: <PsychologyIcon fontSize="large" />,
              color: '#C8A75D',
            },
            {
              title: 'Fomento del Conocimiento',
              desc: 'Recopilación de temas que contribuyen al crecimiento académico, profesional y personal del lector.',
              icon: <AutoStoriesIcon fontSize="large" />,
              color: '#1F3A5F',
            },
          ].map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 10, md: 4 }}
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: item.color,
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {item.icon}
                </Avatar>

                <CardContent
                  sx={{
                    p: 0,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    color="primary"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const AboutPage = () => (
  <Layout>
    <About />
  </Layout>
);

export default AboutPage;