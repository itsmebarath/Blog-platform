import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { toast } from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${postId}`);
      setComments(res.data.data);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/comments', { text, postId });
      setComments([...comments, res.data.data]);
      setText('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-16 border-t border-ink/10 pt-12">
      <h3 className="text-2xl font-serif font-black mb-8 flex items-center gap-3 text-ink">
        Discussion
        <span className="bg-ink text-cream text-xs px-2 py-1 rounded-full font-sans font-bold">{comments.length}</span>
      </h3>

      {error && <ErrorMessage message={error} />}

      <div className="space-y-8 mb-12">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 slide-up">
              <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0 overflow-hidden border border-amber/20">
                {comment.author?.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-amber font-bold text-sm">{comment.author?.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-ink text-sm">{comment.author?.username}</h4>
                  <span className="text-[10px] uppercase tracking-widest text-ink/30 font-bold">
                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now'}
                  </span>
                </div>
                <p className="text-ink/70 text-sm leading-relaxed mb-2">
                  {comment.text}
                </p>
                {isAuthenticated && user._id === comment.author?._id && (
                  <button 
                    onClick={() => handleDelete(comment._id)}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-ink/40 italic text-center py-8">No comments yet. Be the first to share your thoughts.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="comment" className="block text-sm font-bold text-ink/80 mb-3">Leave a comment</label>
            <textarea
              id="comment"
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 bg-cream/50 border border-ink/10 rounded-xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all resize-none text-ink text-sm"
              placeholder="What are your thoughts?..."
              required
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="bg-amber text-ink px-6 py-2.5 rounded-full font-bold hover:bg-amber/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-amber/10"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-ink/60 mb-4">Join the discussion to share your thoughts.</p>
            <Link to="/login" className="inline-block bg-ink text-cream px-8 py-3 rounded-full font-bold hover:bg-ink/90 transition-all">
              Login to Comment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
