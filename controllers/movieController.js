'use strict'

//Requires
const Request = require("request");
const db = require("../database.js");
const axios = require("axios");
const randomNumber = require("../services/randomNumbers");
const messages = require("../services/messages");

const controller = {
    //Get movies from "themoviedb"
    getMovies: function(req,res){
        const valueBody = req.body;
        const apiKey = valueBody.api_key;
        const keyword = valueBody.keyword;
        const sort_by = valueBody.sort_by
        
        //If body has a keyword will search movies related with this
        if(keyword){
            const baseURL = "https://api.themoviedb.org/3/search/keyword?";
            const url = baseURL + "api_key=" + apiKey + "&" + "query=" + keyword;

            Request.get(url, (err, response, body) => {
                if(err) {
                    messages.answer(res.status(400),err.message,null);
                    return;
                }else{
                    messages.answer(res.status(200),"success",JSON.parse(body));
                }
            });
        }else{
            //If hasn't keyword, search all movies
            const baseURL = "https://api.themoviedb.org/3/discover/movie?";
            const url = baseURL + "api_key=" + apiKey + "&" + "sort_by=" + sort_by;

            Request.get(url, (err, response, body) => {
                if(err) {
                    messages.answer(res.status(400),err.message,null);
                    return;
                }else{
                    //If search movies is success, randomNumbers is called to generate randoms numbers and added to data
                    const movies = JSON.parse(body);
                    /*const suggestionScore = "suggestionScore";
                    const max = 99;

                    randomNumber.randomNumber(movies,suggestionScore,max); */
                    randomNumber.randomNumber(movies,"suggestionScore",99);
                
                    messages.answer(res.status(200),"success",movies);
                } 
            });
        }   
    },
    //Get favorite movies of an user
    getFavorites: (req,res) => {
        const arrayMovies = [];
        const sqlMovieUser = "SELECT * FROM favoritos WHERE user_id = ?"
        
        db.all(sqlMovieUser, req.user.sub, async (err, rowFavorites) => {
            if (err) {
                messages.answer(res.status(400),err.message,null);
                return;
            }
            if(!rowFavorites.length){
                messages.answer(res.status(400),"El usuario no tiene peliculas favoritas",null);
                return;
            }

            //If user has favorite movies, will search data from all movies in his list and show them
            await Promise.all(rowFavorites.map(async element => {
                const baseURL = "https://api.themoviedb.org/3/movie/";
                const url = baseURL + element.movie_id + '?api_key=' + req.body.api_key;
                
                const response = await axios.get(url)
                const movieData = response.data;
                arrayMovies.push(movieData);
            }));

            //If user has favorite movies, randomNumbers is called to generate randoms numbers and added to data
            /* const suggestionScore = "suggestionForTodayScore";
            const max = 99; */

            randomNumber.randomNumber(arrayMovies,"suggestionForTodayScore",99);

            messages.answer(res.status(200),"success",arrayMovies);
        })  
    },
    //Add a movie to favoritos
    addFavorites: function(req,res){
        const movieId = req.body.id;
        const userId = req.user.sub;

        //Search if the logued user already has the movie in the body
        const sqlMovieUser = "SELECT * FROM favoritos WHERE user_id = ? AND movie_id = ?"
        const paramsMovie = [userId, movieId]
        const data = {
            "user_id": userId,
            "movie_id": movieId,
        }

        db.get(sqlMovieUser, paramsMovie, function(err, rowFavorite){
            if (err) {
                messages.answer(res.status(400),err.message,null);
                return;
            }
            //If movie is already in favoritos with the logued user get error
            if(rowFavorite){
                messages.answer(res.status(400),"Ya el usuario agregó esa pelicula a sus favoritos",null);
                return;
            }

            const sqlMovie = "INSERT INTO favoritos (user_id, movie_id, addedAt) VALUES (?,?,datetime('now', 'localtime'))"
            db.run(sqlMovie, paramsMovie, function (err, result) {
                if (err) {
                    messages.answer(res.status(400),err.message,null);
                    return;
                }

                messages.answer(res.status(200),"Pelicula agregada a favoritos",data);
            });
        })
    }
};

module.exports = controller;