import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-cream/80 backdrop-blur-md sticky top-0 z-50 border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-black tracking-tighter text-ink flex items-center gap-2">
              <span className="bg-amber text-cream w-8 h-8 flex items-center justify-center rounded-lg">B</span>
              PLATFORM
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-ink/70 hover:text-amber font-medium transition-colors">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create" className="bg-amber text-ink px-5 py-2.5 rounded-full font-bold hover:bg-amber/90 transition-all shadow-lg shadow-amber/20">
                  New Post
                </Link>
                <div className="flex items-center gap-4 pl-4 border-l border-ink/10">
                  <span className="text-sm font-semibold text-ink/80">Hi, {user.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-ink/60 hover:text-red-500 font-medium text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-ink font-medium hover:text-amber transition-colors">Login</Link>
                <Link to="/register" className="bg-ink text-cream px-6 py-2.5 rounded-full font-bold hover:bg-ink/90 transition-all shadow-lg shadow-ink/20">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ink hover:text-amber p-2 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-cream border-b border-ink/5 slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-ink hover:bg-amber/10">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-amber hover:bg-amber/5">New Post</Link>
                <div className="px-3 py-4 border-t border-ink/5">
                  <p className="text-sm text-ink/50 mb-2">Signed in as {user.username}</p>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-left py-2 text-base font-medium text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-ink hover:bg-amber/5">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-ink bg-amber/20">Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
