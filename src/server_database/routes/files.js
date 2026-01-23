const express = require('express');
const router = express.Router();

const filesController = require('../controllers/files'); // files controller
const isLoggedIn = require('../middleware/auth');       // JWT middleware


// Routes for top-level files/folders
router.route('/')
    .post(isLoggedIn, filesController.createFileOrFolder) // Create a new file or folder
    .get(isLoggedIn, filesController.getFiles);           // Get all top-level files/folders

router.route('/deleted')
        .get(isLoggedIn, filesController.getDeletedFiles); // Get all deleted files/folders

router.route('/deleted/:id')
        .post(isLoggedIn, filesController.restoreFileFromBin); // Restore a file/folder by ID

router.route('/shared')
        .get(isLoggedIn, filesController.getSharedFiles); // Get all shared files/folders

router.route('/recent')
        .get(isLoggedIn, filesController.getRecentFiles); // Get all recent files/folders (last week)

router.route('/starred')
        .get(isLoggedIn, filesController.getStarredFiles); // Get all starred files/folders

// Routes for specific file/folder by ID
router.route('/:id')
    .get(isLoggedIn, filesController.getFileById)        // Get a file/folder by ID
    .patch(isLoggedIn, filesController.patchFileById)    // Update a file/folder by ID
    .delete(isLoggedIn, filesController.deleteFileById) // Delete a file/folder by ID
    .post(isLoggedIn, filesController.starOrUnstarFile);

router.route('/:id/children')
    .get(isLoggedIn, filesController.getFolderChildren);

module.exports = router;
