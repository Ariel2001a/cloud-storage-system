const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search');

router.route('/:query')
        .get(searchController.getFilesByQuery)

module.exports = router;