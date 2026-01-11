const express = require('express');
const router = express.Router();

// Auth middleware
const isLoggedIn = require('../middleware/auth');   

// Import controller functions
const {
  createPermission,
  getPermissionsByFile,
  updatePermission,
  deletePermission
} = require('../controllers/permissions');

// Routes for managing permissions (protected)
router.post('/:id/permissions', isLoggedIn, createPermission);
router.get('/:id/permissions', isLoggedIn, getPermissionsByFile);
router.patch('/:id/permissions/:pId', isLoggedIn, updatePermission);
router.delete('/:id/permissions/:pId', isLoggedIn, deletePermission);

module.exports = router;
