import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Stack } from '@mui/material';
import { db } from '../../firebase';
import { collection, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: any;
}

interface CommentSectionProps {
  articleId: string;
  onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "articles", articleId, "comments")
        );
        const querySnapshot = await getDocs(q);
        const fetchedComments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          fetchedComments.push({ id: doc.id, ...doc.data() } as Comment);
        });

        // Sorting manually to avoid missing index errors in Firestore
        fetchedComments.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      setLoading(false);
    };

    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const commentData = {
        articleId,
        authorId: user.uid,
        authorName: user.displayName || 'Anónimo',
        authorPhoto: user.photoURL || '',
        content: newComment,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "articles", articleId, "comments"), commentData);

      // Optimistic comment addition
      setComments((prev) => [{
        id: docRef.id,
        ...commentData,
        createdAt: { toMillis: () => Date.now() } // mock timestamp
      } as unknown as Comment, ...prev]);

      setNewComment('');
      onCommentAdded();

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Avatar src={user.photoURL || undefined} alt={user.displayName || 'User'}>
            {user.displayName?.charAt(0) || 'U'}
          </Avatar>
          <TextField
            size="small"
            fullWidth
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" variant="contained" disabled={!newComment.trim()}>
            Enviar
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Debes iniciar sesión para comentar.
        </Typography>
      )}

      {loading ? (
        <Typography variant="body2" color="text.secondary">Cargando comentarios...</Typography>
      ) : comments.length > 0 ? (
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
              <Avatar src={comment.authorPhoto || undefined} sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                {comment.authorName?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.03)', px: 1.5, py: 1, borderRadius: 2, flexGrow: 1 }}>
                <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {comment.authorName}
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 0.25, fontSize: '0.75rem' }}>
                  {comment.content}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">No hay comentarios aún. ¡Sé el primero!</Typography>
      )}
    </Box>
  );
};

export default CommentSection;
