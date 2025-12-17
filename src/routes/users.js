const express = require('express');
const router = express.Router();
const controller = require('../controllers/users')

router.route('/')
        .post(controller.createUser)
/*
router.route('/:id')
        .get(controller.getArticleById)
        .patch(controller.updateArticleById)
        .put(controller.updateAllArticleById)
        .delete(controller.deleteArticleById)
*/
module.exports = router