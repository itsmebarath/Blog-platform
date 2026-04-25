const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  try {
    const { text, postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    let comment = await Comment.create({
      text,
      post: postId,
      author: req.user._id
    });

    comment = await comment.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort('createdAt')
      .populate('author', 'username avatar');

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
