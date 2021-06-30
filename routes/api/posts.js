const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Mongoose } = require('mongoose');

const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [body('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      // Create an instance of Post model
      const newPost = new Post({
        user: req.user.id, // From Token inside req.user.id
        text: req.body.text, // User input
        name: user.name, // From logged in status
        avatar: user.avatar, // From logged in status
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
  }
);

// @route   Get api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// @route   Get api/posts/:id
// @desc    Get posts by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/delete/:id
// @desc    DELETE posts by ID
// @access  Private
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check user - posts removable only by owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post successfully removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

/*
// @route   Get api/posts/user/:user_id
// @desc    Get posts by user ID
// @access  Private
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const post = await Post.find({ user: req.params.user_id });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    return res.status(500).send('Server Error');
  }
});
*/

module.exports = router;
