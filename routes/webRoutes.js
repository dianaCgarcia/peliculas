'use strict'

//Requires
const express = require("express");
const UserController = require("../controllers/userController");
const MovieController = require("../controllers/movieController");

//Express router
const router = express.Router();

//Middleware
const md_auth = require("../middlewares/authenticated");

/*---------------------User's Routes---------------------*/
//Create Users
router.post("/user",UserController.createUser);
//User Login
router.post("/login",UserController.login);
/*---------------------User's Routes---------------------*/

/*---------------------Movie's Routes---------------------*/
//Get Movies from The Movie DB
router.get("/movies",md_auth.authenticated,MovieController.getMovies);
//Get the favorite movies of one user
router.get("/favorites",md_auth.authenticated,MovieController.getFavorites)
//Add a movie to a user's favorites
router.post("/addFavorite",md_auth.authenticated,MovieController.addFavorites)
/*---------------------Movie's Routes---------------------*/

//Export Module
module.exports = router;