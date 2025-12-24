const express = require('express');
const router = express.Router();

const filesController = require('../controllers/files');

router.route('/')
        .post(filesController.createFileOrFolder)
        .get(filesController.getFiles);

router.route('/:id')
        .get(filesController.getFileById)

module.exports = router;