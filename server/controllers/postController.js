const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Helper: check DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getPosts = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(200).json({
      success: true,
      count: 0,
      pagination: { page: 1, limit: 9, total: 0, pages: 0 },
      data: [],
      _notice: 'Database not connected. Please check your MONGO_URI in server/.env'
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Search query
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('commentCount')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPost = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ success: false, message: 'Database not connected. Please check your MONGO_URI in server/.env' });
  }

  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar email')
      .populate('commentCount');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    req.body.author = req.user._id;
    
    let post = await Post.create(req.body);
    post = await post.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username avatar');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    // Delete post
    await Post.findByIdAndDelete(req.params.id);
    
    // Delete all comments associated with this post
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
