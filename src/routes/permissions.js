const express = require('express');
const router = express.Router();
const {createPermission, getPermissionsByFile, updatePermission} = require('../controllers/permissions');

router.post('/:id/permissions', createPermission);
router.get('/:id/permissions', getPermissionsByFile);
router.patch('/:id/permissions/:pId', updatePermission);

module.exports = router;