import Layout from './components/Layout/Layout';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  )
}

export default App

