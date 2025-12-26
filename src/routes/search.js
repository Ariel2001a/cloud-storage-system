const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search');

// Search files by query
router.route('/:query')
        .get(searchController.getFilesByQuery)   // Search files by query


module.exports = router;