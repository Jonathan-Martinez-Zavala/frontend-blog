import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Stack, Divider, Avatar, IconButton, Button, Card, CardHeader, CardContent } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import LoginIcon from '@mui/icons-material/Login';
import Layout from '../components/Layout/Layout';
import { getById, db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/Comments/CommentSection';
import LoginModal from '../components/Auth/LoginModal';

interface Article {
  id: string;
  authorName: string;
  authorId?: string;
  categoryName: string;
  commentsCount: number;
  likesCount: number;
  views: number;
  content: string;
  title: string;
  createdAt?: any;
}

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      const data = await getById<Article>('articles', id);
      if (data) {
        setArticle(data);
        // Verificar si el usuario ya dio like
        if (user) {
          const likeDoc = await getDoc(doc(db, 'articles', id, 'reactions', user.uid));
          setIsLiked(likeDoc.exists());
        }
      }
      setIsLoading(false);
    };
    fetchArticle();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!article || !id) return;

    const likeRef = doc(db, 'articles', id, 'reactions', user.uid);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
        setArticle({ ...article, likesCount: Math.max(0, article.likesCount - 1) });
        setIsLiked(false);
      } else {
        await setDoc(likeRef, { userId: user.uid, createdAt: new Date() });
        setArticle({ ...article, likesCount: article.likesCount + 1 });
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
  };

  const handleCommentAdded = () => {
    if (article) {
      setArticle({ ...article, commentsCount: article.commentsCount + 1 });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.content.substring(0, 50),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (isLoading) return <Loader />;
  if (!article) return <Typography sx={{ p: 4, textAlign: 'center' }}>Artículo no encontrado.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1.5, md: 3 } }}>
      <Button 
        variant="outlined"
        startIcon={user ? <AppsIcon /> : <LoginIcon />} 
        onClick={() => navigate(user ? '/home' : '/login')} 
        sx={{ mb: 4, textTransform: 'none', borderRadius: 2 }}
      >
        {user ? 'Ver más publicaciones' : 'Ver más publicaciones (Inicia sesión)'}
      </Button>

      <Card sx={{ boxShadow: 'none', borderRadius: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              {article.authorName.charAt(0)}
            </Avatar>
          }
          title={article.authorName}
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption">{article.categoryName}</Typography>
              {article.createdAt && (
                <>
                  <Typography variant="caption">•</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.createdAt.seconds * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </>
              )}
            </Box>
          }
        />

        <CardContent sx={{ pt: 2 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, lineHeight: 1.2 }}>
            {article.title}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8, 
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              fontSize: '1.1rem'
            }}
          >
            {article.content}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Social metrics */}
          <Stack direction="row" spacing={4} alignItems="center" sx={{ mb: 2 }}>
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{ cursor: 'pointer', color: isLiked ? 'primary.main' : 'inherit' }}
              onClick={handleLike}
            >
              {isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              <Typography variant="body2">{article.likesCount}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <ChatBubbleOutlineOutlinedIcon color="action" />
              <Typography variant="body2">{article.commentsCount}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <VisibilityOutlinedIcon />
              <Typography variant="body2">{article.views}</Typography>
            </Stack>

            <IconButton onClick={handleShare}>
              <ShareOutlinedIcon />
            </IconButton>
          </Stack>
        </CardContent>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Comentarios
          </Typography>
          {user ? (
            <CommentSection articleId={id!} onCommentAdded={handleCommentAdded} />
          ) : (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Inicia sesión para participar en la conversación.
              </Typography>
              <Button variant="contained" onClick={() => setIsLoginModalOpen(true)}>
                Iniciar Sesión
              </Button>
            </Box>
          )}
        </Box>
      </Card>
      <LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </Box>
  );
};

const ArticleDetailsPage = () => (
  <Layout>
    <ArticleDetails />
  </Layout>
);

export default ArticleDetailsPage;
