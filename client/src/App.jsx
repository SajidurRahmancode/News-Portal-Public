// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import CreateNewsPage from './pages/CreateNewsPage';
import ContactPage from './pages/ContactPage';
import EditNewsPage from './pages/EditNewsPage';
import UpdateProfilePage from './pages/UpdateProfilePage'; // Add this import

import authStore from './store/authStore';
import './index.css';
import './App.css';
import './components.css';

function App() {
  const loadUser = authStore((state) => state.loadUser);
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/edit-news/:id" element={<EditNewsPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/create-news" element={<CreateNewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/update-profile" element={<UpdateProfilePage />} /> {/* Add this route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;