import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CommentSection from '../components/CommentSection';
import { toast } from 'react-hot-toast';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.data);
      console.log('Fetched post:', res.data.data);
    } catch (err) {
      setError('Post not found or network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure? This will permanently delete your story.')) return;

    try {
      await api.delete(`/posts/${id}`);
      toast.success('Story deleted forever');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete the story');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-20"><ErrorMessage message={error} /></div>;
  if (!post) return null;

  const isAuthor = isAuthenticated && user?._id === post.author?._id;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 md:py-20 fade-in">
      {/* Post Header */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags && Array.isArray(post.tags) && post.tags.map(tag => (
            <span key={tag} className="text-[11px] font-black uppercase tracking-widest text-amber border border-amber/20 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-black text-ink leading-tight mb-8">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-y border-ink/5 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber/10 border border-amber/20 overflow-hidden flex items-center justify-center">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-amber font-bold text-xl">{post.author?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="font-bold text-ink">{post.author?.username}</div>
              <div className="text-sm text-ink/40 font-medium">
                {post.createdAt ? format(new Date(post.createdAt), 'MMMM dd, yyyy') : 'Unknown Date'} • {post.readTime || 0} min read
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-4">
              <Link 
                to={`/edit/${post._id}`}
                className="text-sm font-bold text-ink hover:text-amber transition-colors"
              >
                Edit
              </Link>
              <button 
                onClick={handleDelete}
                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {post.coverImage && (
        <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-ink/5">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="prose font-sans text-ink/80 mb-20 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Author Bio (Optional) */}
      <div className="bg-white p-8 rounded-3xl border border-ink/5 flex flex-col md:flex-row items-center gap-8 mb-20">
        <div className="w-24 h-24 rounded-full bg-cream border border-ink/5 overflow-hidden flex items-center justify-center flex-shrink-0">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-ink font-bold text-4xl">{post.author?.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-xl font-serif font-black text-ink mb-2">Written by {post.author?.username}</h4>
          <p className="text-ink/60 mb-4 leading-relaxed">
            Premium member and contributor. Sharing insights and stories with our global community of thinkers and creators.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <span className="text-xs font-bold uppercase tracking-widest text-ink/30">{post.author?.email}</span>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />
    </article>
  );
};

export default PostDetail;
