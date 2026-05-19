import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg tracking-tight text-white">
          Career<span className="text-gray-500 font-light">Enc</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <span className="text-gray-500 text-sm truncate max-w-[160px]">
                {user?.name}
              </span>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary text-sm px-4 py-2">
                Get Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-400 hover:text-white transition-colors p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-dark-2 border-t border-border px-4 py-4 flex flex-col gap-3 animate-slide-down">
          {isAuthenticated ? (
            <>
              <p className="text-gray-500 text-sm">Signed in as {user?.name}</p>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={close}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn-secondary text-sm text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link to="/signup" onClick={close} className="btn-primary text-sm text-center">
                Get Access
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
