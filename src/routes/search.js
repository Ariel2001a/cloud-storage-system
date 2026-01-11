const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/auth');   

const searchController = require('../controllers/search');

router
  .route('/:query')
  .get(isLoggedIn, searchController.getFilesByQuery);

router.get('/', (req, res) => {
  return res.status(400).json({ error: 'Search query is required' });
});


module.exports = router;