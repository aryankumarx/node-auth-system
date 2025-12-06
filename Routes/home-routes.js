const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

router.get('/c', authMiddleware, (req, res) => {
  res.json({
    message: 'Welcome to home page!',
    user: req.user
  });
});

module.exports = router;
