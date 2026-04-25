const express = require('express');
const { body } = require('express-validator');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', [
  protect,
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('content').isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  validate
], createPost);

router.put('/:id', [
  protect,
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('content').isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  validate
], updatePost);

router.delete('/:id', protect, deletePost);

module.exports = router;
