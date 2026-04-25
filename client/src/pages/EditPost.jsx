import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuth from '../hooks/useAuth';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      const post = res.data.data;
      
      // Security check
      if (post.author._id !== user._id) {
        toast.error('Not authorized to edit this post');
        return navigate('/');
      }

      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        coverImage: post.coverImage || '',
        tags: post.tags.join(', ')
      });
    } catch (err) {
      setError('Failed to load post data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      await api.put(`/posts/${id}`, postData);
      toast.success('Story updated successfully!');
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update story');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-ink mb-4">Edit your story</h1>
        <p className="text-xl text-ink/40 font-medium">Refine your message and perfect your storytelling.</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-ink/5 shadow-2xl shadow-ink/5">
        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-ink/40 mb-3">Story Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            maxLength={200}
            className="w-full text-3xl md:text-4xl font-serif font-bold text-ink border-b border-ink/10 pb-4 focus:border-amber outline-none transition-all placeholder:text-ink/10"
            placeholder="Title of your masterpiece..."
          />
          <div className="text-right text-[10px] font-bold text-ink/20 mt-2">
            {formData.title.length}/200
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-ink/40 mb-3">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-cream/30 border border-ink/5 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink font-medium"
              placeholder="tech, lifestyle, design..."
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-ink/40 mb-3">Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-cream/30 border border-ink/5 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink font-medium"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-ink/40 mb-3">Short Excerpt (Optional)</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            maxLength={300}
            rows="2"
            className="w-full px-5 py-4 bg-cream/30 border border-ink/5 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink font-medium resize-none"
            placeholder="A brief summary for the preview card..."
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-ink/40 mb-3">Content</label>
          <textarea
            name="content"
            required
            value={formData.content}
            onChange={handleChange}
            minLength={20}
            rows="15"
            className="w-full px-5 py-4 bg-cream/30 border border-ink/5 rounded-2xl focus:ring-2 focus:ring-amber focus:border-transparent outline-none transition-all text-ink font-medium leading-relaxed"
            placeholder="Start writing your story here..."
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-ink/5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-ink/40 hover:text-ink transition-colors"
          >
            Cancel Changes
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-cream px-10 py-4 rounded-full font-bold hover:bg-ink/90 transition-all disabled:opacity-50 shadow-xl shadow-ink/20"
          >
            {saving ? 'Updating...' : 'Update Story'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
