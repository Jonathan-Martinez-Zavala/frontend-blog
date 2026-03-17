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

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* Admin */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/users" element={<UsuariosAdminPage />} />
      {/* Ruta 404 sin layout */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App

