'use strict'

var db = require('../database.js');
var jwt = require('../services/jwt');

var controller = {
    //Get all users
    getUsers: function(req,res){
        var sql = "select * from user"
        var params = []

        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            return res.status(200).send({
                "message": "success",
                "data": rows
            })
        });
    },

    //Get an user by id
    getUserId: function(req,res){
        var sql = "select * from user where id = ?"
        var params = [req.params.id]

        db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            return res.status(200).send({
                "message": "success",
                "data": row
            })

        });
    },

    //Add new user
    createUser: function(req,res){
        var errors = []
        if (!req.body.email) {
            errors.push("Falta email");
        }
        if (!req.body.firstName) {
            errors.push("Falta nombre");
        } 
        if (!req.body.lastName) {
            errors.push("Falta apellido");
        }
        if (!req.body.password) {
            errors.push("Falta password");
        }
        if (errors.length) {
            res.status(400).json({ "error": errors.join(", ") });
            return;
        }
        var data = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        }
        var sql = 'INSERT INTO user (email, firstName, lastName, password) VALUES (?,?,?,?)'
        var params = [data.email, data.firstName, data.lastName, data.password]
        
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            return res.status(200).send({
                "message": "success",
                "data": data,
                "id": this.lastID
            })
        });
    },

    //Login
    login: function(req,res) {
        var params = req.body;

        var errors = []
        if (!params.password) {
            errors.push("Falta password");
        }
        if (!params.email) {
            errors.push("Falta email");
        } 
        if (errors.length) {
            res.status(400).json({ "error": errors.join(", ") });
            return;
        }else{
            var sql = "select * from user where email = ?"
            var paramEmail = [params.email]

            db.get(sql, paramEmail, (err, row) => {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }else{
                    if(params.password == row.password){
                        if(params.gettoken){
                            return res.status(200).send({
                                token: jwt.createToken(row)
                            })
                        }
                    }else{
                        res.status(400).json({ "error": "Datos invalidos" });
                        return;
                    }  
                }
            });
        }
    }
};

module.exports = controller;