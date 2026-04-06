import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/Home';
import ContactPage from './pages/Contact';
import AboutPage from './pages/About';
import AdminPage from './pages/Admin/Admin';
import CategoriesPage from './pages/Categories';
import NotFound from './pages/NotFound';
import UsuariosAdminPage from './pages/Admin/Usuarios';
import ArticleFormPage from './pages/Admin/ArticleForm';
import DraftsPage from './pages/Admin/Drafts';
import ArticleDetailsPage from './pages/ArticleDetails';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return null; // Esperar a que el rol se cargue

  if (!user || role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/article/:id" element={<ArticleDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Admin - Protected */}
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UsuariosAdminPage /></AdminRoute>} />
      <Route path="/admin/articles/create" element={<AdminRoute><ArticleFormPage /></AdminRoute>} />
      <Route path="/admin/articles/edit/:id" element={<AdminRoute><ArticleFormPage /></AdminRoute>} />
      <Route path="/admin/drafts" element={<AdminRoute><DraftsPage /></AdminRoute>} />

      {/* Ruta 404 sin layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App

