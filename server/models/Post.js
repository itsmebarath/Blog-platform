const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minlength: [20, 'Content must be at least 20 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  coverImage: {
    type: String,
    default: ''
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readTime: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comment count
postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Pre-save hook for readTime and excerpt
postSchema.pre('save', function(next) {
  // Calculate read time (words / 200)
  const words = this.content.split(/\s+/).length;
  this.readTime = Math.max(1, Math.round(words / 200));

  // Generate excerpt if not provided
  if (!this.excerpt) {
    this.excerpt = this.content.substring(0, 297) + '...';
  }
  
  next();
});

module.exports = mongoose.model('Post', postSchema);
