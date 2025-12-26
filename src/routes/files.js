const express = require('express');       // import Express framework
const router = express.Router();          // create a new router

const filesController = require('../controllers/files'); // import files controller

// Route to create a new file or folder
router.post('/', filesController.createFileOrFolder);

// Route to get user's files
router.get('/', filesController.getFiles);

module.exports = router; // export the router
