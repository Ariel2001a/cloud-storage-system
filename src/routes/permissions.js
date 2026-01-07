const express = require('express');
const router = express.Router();

// Import controller functions for handling permissions
const {createPermission, getPermissionsByFile, updatePermission, deletePermission, getPermissionsByDeletedFile,getPermissionsBySharedFile} = require('../controllers/permissions');

// Define routes for managing permissions
router.post('/:id/permissions', createPermission);
router.get('/:id/permissions', getPermissionsByFile);
router.patch('/:id/permissions/:pId', updatePermission);
router.delete('/:id/permissions/:pId', deletePermission);

router.get('/deleted/:id/permissions/:pId',getPermissionsByDeletedFile);
router.get('/shared/:id/permissions/:pId', getPermissionsBySharedFile);
// Export the router
module.exports = router;