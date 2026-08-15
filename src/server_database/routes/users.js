// routes/users.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

// Create a new user
router.route('/')
    .post(controller.createUser);

// Get user details by ID
router.route('/:id')
    .get(controller.getUserById);

// Login / check user credentials
router.route('/tokens')
    .post(controller.checkUser);

module.exports = router;