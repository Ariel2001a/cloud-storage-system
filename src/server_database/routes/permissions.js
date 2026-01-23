const express = require('express');
const router = express.Router();
// Auth middleware
const {
  createPermissionByUsername,
  getPermissionsByFile,
  updatePermission,
  deletePermission,
  getPermissionsByDeletedFile,
  getPermissionsBySharedFile,
  getPermissionsByDetails
} = require('../controllers/permissions');

// Define routes for managing permissions
router.post('/:id/permissions', createPermissionByUsername);
router.get('/:id/permissions', getPermissionsByFile);
router.patch('/:id/permissions/:pId', updatePermission);
router.delete('/:id/permissions/:pId', deletePermission);

router.get('/:id/permission', getPermissionsByDetails)

router.get('/deleted/:id/permissions/:pId', getPermissionsByDeletedFile);
router.get('/shared/:id/permissions/:pId', getPermissionsBySharedFile);

module.exports = router;

