const express = require('express');       // import Express framework
const router = express.Router();          // create a new router

const filesController = require('../controllers/files'); // import files controller

// Routes for top-level files/folders
router.route('/')
        .post(filesController.createFileOrFolder)  // Create a new file or folder
        .get(filesController.getFiles);   // Get all top-level files/folders

router.route('/deleted')
        .get(filesController.getDeletedFiles); // Get all deleted files/folders

router.route('/deleted/:id')
        .post(filesController.restoreFileFromBin); // Restore a file/folder by ID

router.route('/shared')
        .get(filesController.getSharedFiles); // Get all shared files/folders

router.route('/recent')
        .get(filesController.getRecentFiles); // Get all recent files/folders (last week)

router.route('/starred')
        .get(filesController.getStarredFiles); // Get all starred files/folders

// Routes for specific file/folder by ID
router.route('/:id')
        .get(filesController.getFileById2)   // Get a file/folder by ID
        .patch(filesController.patchFileById)  // Update a file/folder by ID
        .delete(filesController.deleteFileById) // Delete a file/folder by ID
        .post(filesController.starOrUnstarFile)


router.route('/:id/children')
        .get(filesController.getFolderChildren);


module.exports = router; // export the router