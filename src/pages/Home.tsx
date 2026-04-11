import React, { useEffect, useState } from 'react';
import { Typography, Box, Stack, Card, Divider, Avatar, CardHeader, CardContent, Drawer, IconButton, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Layout from '../components/Layout/Layout';
import { getAll, updateDocument } from '../firebase';
import Loader from '../components/Loader';
import CommentSection from '../components/Comments/CommentSection';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import LoginModal from '../components/Auth/LoginModal';

interface Article {
  id: string;
  authorName: string;
  authorId?: string;
  authorPhotoURL?: string;
  categoryName: string;

  commentsCount: number;
  likesCount: number;
  views: number;

  content: string;
  excerpt: string;

  featured: boolean;

  slug: string;
  status: 'draft' | 'published';

  title: string;
  createdAt?: any;
}

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Router properties
  const location = useLocation();
  const navigate = useNavigate();
  const categoryFilter = location.state?.categoryName as string | undefined;

  // Estados interactivos
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const { user, role } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await getAll<Article>('articles');

      response.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      let filtered = response;

      // Filter based on category if provided
      if (categoryFilter) {
        filtered = filtered.filter(a => a.categoryName === categoryFilter);
      }

      // Hide all drafts from the main feed, drafts are only managed in the Admin/Drafts section
      // Si el artículo no tiene status definido (antiguo), se trata como 'published'
      filtered = filtered.filter(a => a.status !== 'draft');

      setArticles(filtered);
      setIsLoading(false);
    };
    fetchArticles();
  }, [categoryFilter]);

  // Revisar si el usuario ya dio like a los articulos cargados
  const articleIds = articles.map(a => a.id).join(',');

  useEffect(() => {
    if (!user || !articleIds) return;

    const fetchLikes = async () => {
      const likesMap: Record<string, boolean> = {};
      const ids = articleIds.split(',');

      await Promise.all(
        ids.map(async (id) => {
          const reactionRef = doc(db, 'articles', id, 'reactions', user.uid);
          try {
            const reactionSnap = await getDoc(reactionRef);
            if (reactionSnap.exists()) {
              likesMap[id] = true;
            }
          } catch (e) {
            console.error('Error verificando like:', e);
          }
        })
      );

      setLikedArticles(likesMap);
    };

    fetchLikes();
  }, [user, articleIds]);

  const handleLike = async (articleId: string, currentLikes: number) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const isLiked = likedArticles[articleId];
    const newLikesCount = isLiked ? currentLikes - 1 : currentLikes + 1;

    // Actualizar estado local (Optimistic UI)
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, likesCount: newLikesCount } : a));
    setLikedArticles(prev => ({ ...prev, [articleId]: !isLiked }));

    // Actualizar Firebase
    try {
      const reactionRef = doc(db, 'articles', articleId, 'reactions', user.uid);

      if (isLiked) {
        // Retirar reaccion (borrar documento subtabla)
        await deleteDoc(reactionRef);
      } else {
        // Crear reaccion (documento en subtabla)
        await setDoc(reactionRef, {
          type: 'like',
          userId: user.uid
        });
      }

      // Se actualiza el contador general en el artículo
      await updateDocument('articles', articleId, { likesCount: newLikesCount });
    } catch (error) {
      console.error("Error al reaccionar:", error);
      // Revertir en caso de error
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, likesCount: currentLikes } : a));
      setLikedArticles(prev => ({ ...prev, [articleId]: isLiked }));
    }
  };

  const handleToggleComments = (id: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setExpandedCommentsId(expandedCommentsId === id ? null : id);
  };

  const handleShare = (title: string, content: string, id: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const shareUrl = `${window.location.origin}/article/${id}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 50),
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Enlace copiado al portapapeles');
    }
  };

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
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      try {
        await deleteDoc(doc(db, 'articles', selectedArticleId));
        setArticles(prev => prev.filter(a => a.id !== selectedArticleId));
        handleMenuClose();
      } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        alert("Hubo un error al intentar eliminar el artículo.");
      }
    }
  };

  return (
    <Box>
      {/* <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Inicio</Typography>
      <Typography color="text.secondary">“Bienvenido a la página principal del blog. Aquí podrás explorar las publicaciones más recientes.”</Typography> */}

      {isLoading ? (
        <Loader />
      ) : (
        <Stack spacing={2}>
          {categoryFilter && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                Explorando: {categoryFilter}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/home', { replace: true, state: {} })}
                startIcon={<CloseOutlinedIcon />}
              >
                Borrar Filtro
              </Button>
            </Box>
          )}

          {articles.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
              No hay artículos para mostrar.
            </Typography>
          ) : (
            articles.map(article => (
              <Card
                key={article.id}
                sx={{
                  width: { md: '100%' },
                  p: 1.5,
                  borderRadius: 0,
                  boxShadow: 'none',
                  transition: '0.2s',
                }}            >
                {/* Header tipo Facebook optimizado */}
                <CardHeader
                  sx={{ p: 0, mb: 1.5 }}
                  avatar={
                    <Avatar 
                      src={article.authorPhotoURL || ''} 
                      sx={{ width: 36, height: 36, fontSize: '0.9rem' }}
                    >
                      {article.authorName.charAt(0)}
                    </Avatar>
                  }
                  title={article.authorName}
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                  action={
                    user && role === 'admin' ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mr: 1, mt: 1 }}>
                        {article.status === 'draft' && (
                          <Chip label="Borrador" size="small" color="warning" variant="outlined" sx={{ height: 24, fontSize: '0.7rem' }} />
                        )}
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, article.id)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : null
                  }
                  subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption">{`Categoría: ${article.categoryName}`}</Typography>
                      {article.createdAt && article.createdAt.seconds && (
                        <>
                          <Typography variant="caption">•</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(article.createdAt.seconds * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                          </Typography>
                        </>
                      )}
                    </Box>
                  }
                />

                <CardContent
                  sx={{
                    p: 0,
                    '&:last-child': {
                      pb: 0
                    }
                  }}
                >
                  {/* Título */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.2 }}>
                    {article.title}
                  </Typography>

                {/* Contenido Completo */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 1.5, 
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {article.content}
                </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Métricas estilo redes */}
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        cursor: 'pointer',
                        color: likedArticles[article.id] ? 'primary.main' : 'inherit'
                      }}
                      onClick={() => handleLike(article.id, article.likesCount)}
                    >
                      {likedArticles[article.id] ? (
                        <ThumbUpIcon fontSize="small" />
                      ) : (
                        <ThumbUpOutlinedIcon fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {article.likesCount}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleToggleComments(article.id)}
                    >
                      <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                      <Typography variant="body2">
                        {article.commentsCount}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleShare(article.title, article.content, article.id)}
                    >
                      <ShareOutlinedIcon fontSize="small" />
                      <Typography variant="body2">
                        Compartir
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )))}
        </Stack>
      )}

      {/* Menú Lateral de Comentarios con Overlay Sutil */}
      <Drawer
        anchor="right"
        open={Boolean(expandedCommentsId)}
        onClose={() => setExpandedCommentsId(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400, md: 450 },
            p: 0,
            boxShadow: 'none',
            borderLeft: '1px solid',
            borderColor: 'divider'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.31)'
          }
        }}
      >
        {expandedCommentsId && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">Comentarios</Typography>
              <IconButton onClick={() => setExpandedCommentsId(null)} size="small">
                <CloseOutlinedIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              <CommentSection
                articleId={expandedCommentsId}
                onCommentAdded={() => {
                  const article = articles.find(a => a.id === expandedCommentsId);
                  if (article) {
                    const newCommentsCount = (article.commentsCount || 0) + 1;
                    setArticles(prev => prev.map(a => a.id === expandedCommentsId ? { ...a, commentsCount: newCommentsCount } : a));
                    updateDocument('articles', expandedCommentsId, { commentsCount: newCommentsCount }).catch(e => console.error("Error al actualizar cant. de comentarios:", e));
                  }
                }}
              />
            </Box>

          </Box>
        )}
      </Drawer>
      <LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Menú de Opciones para Admin */}
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

const HomePage = () => (
  <Layout>
    <Home />
  </Layout>
);

export default HomePage;
