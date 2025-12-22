const express = require('express');
const router = express.Router();

const filesController = require('../controllers/files');

router.post('/', filesController.createFileOrFolder);
router.get('/', filesController.getFiles);

module.exports = router;