import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem, Snackbar, Alert } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import { db, getAll, getById, updateDocument } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

const ArticleForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAll<Category>('categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getById<any>('articles', id).then((article) => {
        if (article) {
          setTitle(article.title || '');
          setContent(article.content || '');
          setCategoryId(article.categoryId || '');
          setStatus(article.status || 'published');
        }
        setLoading(false);
      });
    }
  }, [id]);

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !categoryId) return;

    setLoading(true);
    try {
      const selectedCategory = categories.find(c => c.id === categoryId);

      const articlePayload = {
        title,
        content,
        categoryId,
        categoryName: selectedCategory?.name || '',
        slug: createSlug(title),
        status,
        authorName: user?.displayName || 'Anónimo',
        authorId: user?.uid || null,
        authorPhotoURL: user?.photoURL || null
      };

      if (id) {
        // Actualizar existente
        await updateDocument('articles', id, {
          ...articlePayload,
          updatedAt: serverTimestamp()
        });
      } else {
        // Crear nuevo
        await addDoc(collection(db, 'articles'), {
          ...articlePayload,
          views: 0,
          likesCount: 0,
          commentsCount: 0,
          createdAt: serverTimestamp()
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 1500);

    } catch (error) {
      console.error("Error al crear artículo", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        {id ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        <TextField
          label="Título del Artículo"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          select
          label="Categoría"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
          {categories.length === 0 && (
            <MenuItem disabled value="">Cargando categorías...</MenuItem>
          )}
        </TextField>

        <TextField
          label="Contenido Principal"
          variant="outlined"
          fullWidth
          multiline
          rows={10}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              fullWidth
            >
              <MenuItem value="published">Publicado</MenuItem>
              <MenuItem value="draft">Borrador</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !title || !content || !categoryId}
          sx={{ mt: 2 }}
        >
          {loading ? 'Guardando...' : (id ? 'Guardar Cambios' : 'Publicar Artículo')}
        </Button>

      </Box>

      <Snackbar open={success} autoHideDuration={3000}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {id ? '¡Artículo actualizado exitosamente!' : '¡Artículo publicado exitosamente!'} Redirigiendo...
        </Alert>
      </Snackbar>
    </Box>
  );
};

const ArticleFormPage = () => (
  <Layout>
    <ArticleForm />
  </Layout>
);

export default ArticleFormPage;
