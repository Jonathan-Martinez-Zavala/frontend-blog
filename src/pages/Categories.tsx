import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, Grid } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { getAll } from '../firebase';
import Loader from '../components/Loader';

interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string;
}

const getCategoryIcon = (name: string) => {
  const normalized = name.toLowerCase();

  if (normalized.includes('historia')) {
    return <AutoStoriesIcon color="primary" fontSize="large" />;
  }
  if (normalized.includes('leccion') || normalized.includes('lección')) {
    return <SchoolIcon color="primary" fontSize="large" />;
  }
  if (normalized.includes('conferencia') || normalized.includes('evento')) {
    return <RecordVoiceOverIcon color="primary" fontSize="large" />;
  }
  if (normalized.includes('experiencia') || normalized.includes('caso')) {
    return <PsychologyIcon color="primary" fontSize="large" />;
  }
  if (normalized.includes('frase')) {
    return <FormatQuoteIcon color="primary" fontSize="large" />;
  }
  if (normalized.includes('reflexion') || normalized.includes('reflexión')) {
    return <LightbulbIcon color="primary" fontSize="large" />;
  }

  return <CategoryIcon color="primary" fontSize="large" />;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAll<Category>('categories');
        setCategories(response);
      } catch (error) {
        console.error("Error obteniendo categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    navigate('/home', { state: { categoryName: category.name } });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Categorías</Typography>
      <Typography color="text.secondary">Explora artículos por categoría.</Typography>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Loader />
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            {categories.map((cat) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
                <Card
                  sx={{
                    p: 3,
                    width: '100%',
                    height: 200,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    border: '1px solid #DDD',
                    boxShadow: 'none',
                    transition: '0.2s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'rgba(0,0,0,0.01)',
                    }
                  }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <Box sx={{ mb: 1 }}>
                    {getCategoryIcon(cat.name || '')}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {cat.name || 'Sin Título'}
                    </Typography>
                    {cat.description && (
                      <Typography variant="body2" color="text.secondary">
                        {cat.description}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}

            {categories.length === 0 && !isLoading && (
              <Grid size={{ xs: 12 }}>
                <Typography color="text.secondary">No hay categorías registradas.</Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

const CategoriesPage = () => (
  <Layout>
    <Categories />
  </Layout>
);

export default CategoriesPage;