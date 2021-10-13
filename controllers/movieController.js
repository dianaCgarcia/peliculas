'use strict'

var Request = require("request");
var db = require('../database.js');

var controller = {
    getMovies: function(req,res){

        if(req.body.keyword){
            var data = {
                api_key: req.body.api_key,
                keyword: req.body.keyword
            }

            var baseURL = "https://api.themoviedb.org/3/search/keyword?";
            var url = baseURL + 'api_key=' + data.api_key + '&' + 'query=' + data.keyword;

            Request.get(url, (error, response, body) => {
                if(error) {
                    return console.dir(error);
                }else{
                    return res.status(200).send({
                        "message": "success",
                        "data": (body)
                    })
                }
            });
        }else{
            var data = {
                api_key: req.body.api_key,
                sort_by: req.body.sort_by
            }
            var baseURL = "https://api.themoviedb.org/3/discover/movie?";
            var url = baseURL + 'api_key=' + data.api_key + '&' + 'sort_by=' + data.sort_by;

            Request.get(url, (error, response, body) => {
                if(error) {
                    return console.dir(error);
                }else{

                    var movieData = JSON.parse(body);
                    var randomNumbers = [];
                    var suggestionScore = 'suggestionScore';
                    var max = 99;

                    for(let value of movieData.results){
                        var randomNum = Math.floor(Math.random() * max);

                        if(!randomNumbers.length){
                            randomNumbers.push(randomNum);
                        }else{
                            var repeted = true;
                            while(repeted == true){
                                if(randomNumbers.indexOf(randomNum) < 0){
                                    randomNumbers.push(randomNum);
                                    repeted = false;
                                }else{
                                    randomNum = Math.floor(Math.random() * max);
                                }
                            }
                            
                        } 
                        value[suggestionScore] = randomNum;

                        movieData.results.sort(function(a, b) {
                            return b.suggestionScore - a.suggestionScore;
                        });
                    }
                
                    return res.status(200).send({
                        "message": "success",
                        "data": movieData
                    })
                } 
            });
        }
        
    },

    getFavorites: function(req,res){
        var userEmail = req.user.email;

        var sql = "SELECT * FROM user WHERE email = ?"
        db.get(sql, userEmail, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }else{
                var sqlMovieUser = "SELECT * FROM favoriteMovie WHERE user_id = ?"
                var paramsMovie = [row.id]
                db.get(sqlMovieUser, paramsMovie, function(err, row){
                    if (err) {
                        res.status(400).json({ "error": err.message })
                        return;
                    }

                    return res.status(200).send({
                        "message": "success",
                        "data": row
                    })
                })
                
                
            }
        });
    },

    addFavorites: function(req,res){

        var movieId = req.body.id;
        var userEmail = req.user.email;

        var sql = "SELECT * FROM user WHERE email = ?"
        db.get(sql, userEmail, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }else{
                var sqlMovieUser = "SELECT * FROM favoriteMovie WHERE user_id = ? AND movie_id = ?"
                var paramsMovie = [row.id, movieId]
                db.get(sqlMovieUser, paramsMovie, function(err, rowFavorite){
                    if (err) {
                        res.status(400).json({ "error": err.message })
                        return;
                    }

                    if(rowFavorite){
                        res.status(400).send({
                            "message": "Ya el usuario agregó esa pelicula a sus favoritos"
                        })
                        return;
                    }

                    var sqlMovie = "INSERT INTO favoriteMovie (user_id, movie_id) VALUES (?,?)"
                    db.run(sqlMovie, paramsMovie, function (err, result) {
                        if (err) {
                            res.status(400).json({ "error": err.message })
                            return;
                        }

                        return res.status(200).send({
                            "message": "success",
                            "data": paramsMovie
                        })
                    });
                })
                
                
            }
        });
    }
};

module.exports = controller;