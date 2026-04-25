const express = require('express');
const { body } = require('express-validator');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post('/', [
  protect,
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  body('postId').notEmpty().withMessage('Post ID is required'),
  validate
], createComment);

router.get('/:postId', getComments);
router.delete('/:id', protect, deleteComment);

module.exports = router;
