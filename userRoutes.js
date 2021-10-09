'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var router = express.Router();

router.get('/users',UserController.getUsers);

router.get('/user/:id',UserController.getUserId);

router.post('/user',UserController.createUser);

router.post('/login',UserController.login);

module.exports = router;