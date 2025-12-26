const express = require('express');
const router = express.Router();

const filesController = require('../controllers/files');

// Routes for top-level files/folders
router.route('/')
        .post(filesController.createFileOrFolder)  // Create a new file or folder
        .get(filesController.getFiles);   // Get all top-level files/folders

// Routes for specific file/folder by ID
router.route('/:id')
        .get(filesController.getFileById)   // Get a file/folder by ID
        .patch(filesController.patchFileById)  // Update a file/folder by ID
        .delete(filesController.deleteFileById) // Delete a file/folder by ID


module.exports = router;