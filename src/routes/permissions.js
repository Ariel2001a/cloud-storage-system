const express = require('express');
const router = express.Router();
// Auth middleware
const isLoggedIn = require('../middleware/auth');   
const {
  createPermission,
  getPermissionsByFile,
  updatePermission,
  deletePermission,
  getPermissionsByDeletedFile,
  getPermissionsBySharedFile
} = require('../controllers/permissions');

// Define routes for managing permissions
router.post('/:id/permissions', isLoggedIn, createPermissionByUsername);
router.get('/:id/permissions', isLoggedIn, getPermissionsByFile);
router.patch('/:id/permissions/:pId', isLoggedIn, updatePermission);
router.delete('/:id/permissions/:pId', isLoggedIn, deletePermission);

router.get('/deleted/:id/permissions/:pId', isLoggedIn, getPermissionsByDeletedFile);
router.get('/shared/:id/permissions/:pId', isLoggedIn, getPermissionsBySharedFile);

module.exports = router;

