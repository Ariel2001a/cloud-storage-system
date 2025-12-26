const express = require('express');       // import Express framework
const router = express.Router();          // create a new router

const filesController = require('../controllers/files'); // import files controller

router.route('/')
        .post(filesController.createFileOrFolder)
        .get(filesController.getFiles);

router.route('/:id')
        .get(filesController.getFileById)

module.exports = router; // export the router