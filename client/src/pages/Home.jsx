import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbWarning, setDbWarning] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts', {
        params: {
          page,
          search: searchTerm,
          limit: 9
        }
      });
      setPosts(res.data.data);
      setPagination(res.data.pagination);
      setError(null);
      // Show a warning if DB is not connected (server returned _notice)
      if (res.data._notice) {
        setDbWarning('⚠️ Database not connected — please update your MongoDB password in server/.env, then restart the server.');
      } else {
        setDbWarning(null);
      }
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif font-black text-ink tracking-tight">
          Read. Write. <span className="text-amber">Grow.</span>
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto font-medium">
          The destination for premium insights, deep dives, and creative storytelling from around the globe.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-16 relative">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search articles, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-5 bg-white border border-ink/5 rounded-full shadow-2xl shadow-ink/5 focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all pr-16 text-lg font-medium"
          />
          <button 
            type="submit"
            className="absolute right-3 top-3 bg-ink text-cream p-3 rounded-full hover:bg-ink/90 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {dbWarning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-800 font-medium text-sm flex items-start gap-3">
          <span className="text-xl leading-none">⚠️</span>
          <span>{dbWarning}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 slide-up">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-ink/10">
              <p className="text-2xl text-ink/40 font-serif italic">No stories found matching your criteria.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                <button 
                  onClick={() => { setSearchTerm(''); setPage(1); }}
                  className="text-amber font-bold hover:underline"
                >
                  Clear all filters
                </button>
                {searchTerm && (
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-ink text-cream px-6 py-2 rounded-full font-bold hover:bg-ink/90 transition-all text-sm"
                  >
                    Search the Web for "{searchTerm}"
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-3 rounded-full bg-white border border-ink/5 disabled:opacity-30 hover:bg-ink/5 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      page === i + 1 ? 'bg-amber text-ink' : 'bg-white border border-ink/5 hover:bg-ink/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="p-3 rounded-full bg-white border border-ink/5 disabled:opacity-30 hover:bg-ink/5 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
