import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream selection:bg-amber selection:text-ink">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#faf8f4',
            borderRadius: '12px',
            fontWeight: 'bold',
          },
          success: {
            iconTheme: {
              primary: '#e8a020',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
      
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
          
          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-9xl font-serif font-black text-ink/10">404</h1>
              <h2 className="text-3xl font-serif font-black text-ink -mt-12 mb-6">Page Not Found</h2>
              <p className="text-ink/60 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved to another universe.</p>
              <a href="/" className="bg-amber text-ink px-8 py-3 rounded-full font-bold hover:bg-amber/90 transition-all shadow-lg shadow-amber/20">
                Back to Home
              </a>
            </div>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
