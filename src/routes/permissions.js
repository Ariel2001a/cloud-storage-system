const express = require('express');
const router = express.Router();
const {createPermission} = require('../controllers/permissions');

router.post('/:id/permissions', createPermission);

module.exports = router;