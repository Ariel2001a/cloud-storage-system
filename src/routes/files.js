const express = require('express');
const router = express.Router();

const filesController = require('../controllers/files'); // files controller
const isLoggedIn = require('../middleware/auth');       // JWT middleware

// Routes for top-level files/folders
router.route('/')
    .post(isLoggedIn, filesController.createFileOrFolder) // Create a new file or folder
    .get(isLoggedIn, filesController.getFiles);           // Get all top-level files/folders

// Routes for specific file/folder by ID
router.route('/:id')
    .get(isLoggedIn, filesController.getFileById)        // Get a file/folder by ID
    .patch(isLoggedIn, filesController.patchFileById)    // Update a file/folder by ID
    .delete(isLoggedIn, filesController.deleteFileById); // Delete a file/folder by ID

module.exports = router;

router.route('/:id/children')
        .get(filesController.getFolderChildren);


