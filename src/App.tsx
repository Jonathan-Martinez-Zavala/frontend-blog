import Layout from './components/Layout/Layout';
import { Typography, Box } from '@mui/material';

function App() {
  return (
    <Layout>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          Bienvenido
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
          Explora los últimos artículos sobre tecnología, diseño y desarrollo.
        </Typography>
      </Box>


    </Layout>
  )
}

export default App

