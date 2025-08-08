import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authStore from '../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout } = authStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            NewsPortal
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10 items-center">
            <Link to="/" className="hover:text-accent transition py-3 px-2">Home</Link>
            <Link to="/news" className="hover:text-accent transition py-3 px-2">News</Link>
            <Link to="/contact" className="hover:text-accent transition py-3 px-2">Contact</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="hover:text-accent transition py-3 px-2">Dashboard</Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-sm px-2">Welcome, {user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-accent hover:bg-blue-700 px-6 py-3 rounded-md transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-secondary hover:bg-blue-800 px-6 py-3 rounded-md transition text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-accent hover:bg-blue-700 px-6 py-3 rounded-md transition text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link 
              to="/" 
              className="block py-3 hover:bg-blue-800 rounded px-4 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/news" 
              className="block py-3 hover:bg-blue-800 rounded px-4 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link 
              to="/contact" 
              className="block py-3 hover:bg-blue-800 rounded px-4 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="block py-3 hover:bg-blue-800 rounded px-4 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <div className="pt-3 border-t border-blue-800 mt-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm py-3 px-4">Welcome, {user?.username}</div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-accent hover:bg-blue-700 px-6 py-3 rounded-md transition text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 px-2">
                  <Link 
                    to="/login" 
                    className="flex-1 bg-secondary hover:bg-blue-800 px-6 py-3 rounded-md transition text-sm text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex-1 bg-accent hover:bg-blue-700 px-6 py-3 rounded-md transition text-sm text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;