'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var MovieController = require('../controllers/movieController');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.get('/users',UserController.getUsers);

router.get('/user/:id',UserController.getUserId);

router.post('/user',UserController.createUser);

router.post('/login',UserController.login);

router.get('/movies',MovieController.getMovies);

router.get('/favorites',md_auth.authenticated,MovieController.getFavorites)

router.post('/addFavorite',md_auth.authenticated,MovieController.addFavorites)

module.exports = router;