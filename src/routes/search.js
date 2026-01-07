const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search');

// Search files by query
router.route('/:query')
        .get(searchController.getFilesByQuery)   // Search files by query

router.get('/', (req, res) => {
  return res.status(400).json({ error: 'Search query is required' });
});


module.exports = router;