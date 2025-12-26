const express = require('express');
const router = express.Router();
const {createPermission, getPermissionsByFile, updatePermission, deletePermission} = require('../controllers/permissions');

router.post('/:id/permissions', createPermission);
router.get('/:id/permissions', getPermissionsByFile);
router.patch('/:id/permissions/:pId', updatePermission);
router.delete('/:id/permissions/:pId', deletePermission);

module.exports = router;