const express = require('express');
const router = express.Router();

const filesController = require('../controllers/files'); // files controller
const isLoggedIn = require('../middleware/auth');       // JWT middleware

const tempBypass = (req, res, next) => {
        req.userId = 1;
        next();
};

// Routes for top-level files/folders
router.route('/')
        .post(tempBypass, filesController.createFileOrFolder) // Create a new file or folder
        .get(tempBypass, filesController.getFiles);           // Get all top-level files/folders

router.route('/deleted')
        .get(tempBypass, filesController.getDeletedFiles); // Get all deleted files/folders

router.route('/deleted/:id')
        .post(tempBypass, filesController.restoreFileFromBin); // Restore a file/folder by ID

router.route('/shared')
        .get(tempBypass, filesController.getSharedFiles); // Get all shared files/folders

router.route('/recent')
        .get(tempBypass, filesController.getRecentFiles); // Get all recent files/folders (last week)

router.route('/starred')
        .get(tempBypass, filesController.getStarredFiles); // Get all starred files/folders

// Routes for specific file/folder by ID
router.route('/:id')
        .get(tempBypass, filesController.getFileById)        // Get a file/folder by ID
        .patch(tempBypass, filesController.patchFileById)    // Update a file/folder by ID
        .delete(tempBypass, filesController.deleteFileById) // Delete a file/folder by ID
        .post(tempBypass, filesController.starOrUnstarFile);

router.route('/:id/children')
        .get(tempBypass, filesController.getFolderChildren);

module.exports = router;
