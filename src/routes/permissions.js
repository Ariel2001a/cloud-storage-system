const express = require('express');
const router = express.Router();
const {createPermission, getPermissionsByFile} = require('../controllers/permissions');

router.post('/:id/permissions', createPermission);
router.get('/:id/permissions', getPermissionsByFile);

module.exports = router;