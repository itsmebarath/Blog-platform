import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }) => {
  const { _id, title, excerpt, author, coverImage, tags, createdAt, readTime } = post;

  return (
    <Link to={`/posts/${_id}`} className="group">
      <article className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(232,160,32,0.1)] transition-all duration-500 transform hover:-translate-y-3 flex flex-col h-full border border-ink/5">
        <div className="relative h-64 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber/10 via-cream to-ink/5 flex items-center justify-center font-serif text-ink/10 text-6xl">
              {title.charAt(0)}
            </div>
          )}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            {tags && Array.isArray(tags) && tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-white/80 backdrop-blur-md text-ink text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-3 text-[10px] text-ink/30 mb-4 font-black uppercase tracking-[0.2em]">
            <span>{createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Recently'}</span>
            <span className="w-1 h-1 rounded-full bg-amber/30"></span>
            <span>{readTime || 0} min read</span>
          </div>
          
          <h2 className="text-2xl font-serif font-black text-ink mb-4 line-clamp-2 leading-tight group-hover:text-amber transition-colors">
            {title || 'Untitled Story'}
          </h2>
          
          <p className="text-ink/50 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed font-medium">
            {excerpt}
          </p>

          <div className="flex items-center gap-4 pt-6 border-t border-ink/5">
            <div className="w-10 h-10 rounded-full bg-amber/5 flex items-center justify-center overflow-hidden border border-amber/10 p-0.5">
              {author?.avatar ? (
                <img src={author.avatar} alt={author.username} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-amber/10 flex items-center justify-center text-amber font-black text-xs uppercase">
                  {author?.username?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-ink tracking-tight">{author?.username}</span>
              <span className="text-[9px] text-ink/30 font-bold uppercase tracking-widest">Contributor</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
