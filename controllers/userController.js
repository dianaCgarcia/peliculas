'use strict'

//Requires
const db = require("../database.js");
const jwt = require("../services/jwt");
const messages = require("../services/messages");
const bcrypt = require("bcrypt");
const validator = require("email-validator");

const controller = {
    //Add new user in database
    createUser: function(req,res){
        const valueBody = req.body;
        const salt = 10;
        let errors = [];

        //Validate field email isn't empty and its format is valid
        if (!valueBody.email) {
            errors.push("Falta email");
        }else{
            if(!validator.validate(valueBody.email)){
                errors.push("Formato de email invalido");
            }
        }
        //Validate fields aren't empty
        if (!valueBody.firstName) {
            errors.push("Falta nombre");
        } 
        if (!valueBody.lastName) {
            errors.push("Falta apellido");
        }
        if (!valueBody.password) {
            errors.push("Falta password");
        }
        //If fields are empty, send error
        if (errors.length) {
            messages.answer(res.status(400),errors.join(", "),null);
        }

        //Asign value of req.body to variable data
        let data = {
            email: valueBody.email,
            firstName: valueBody.firstName,
            lastName: valueBody.lastName,
            password: valueBody.password
        }

        //Encript password
        bcrypt.hash(valueBody.password, salt, (err, hash) => {
            data.password = hash;

            //Query to insert in table user and params to execute insert query
            const sql = "INSERT INTO user (email, firstName, lastName, password) VALUES (?,?,?,?)"
            const params = [data.email, data.firstName, data.lastName, data.password]
            
            //Execute query 
            db.run(sql, params, function (err, result) {
                if (err) {
                    messages.answer(res.status(400),"Usuario ya existe",null);
                    return;
                }
                messages.answer(res.status(200),"Usuario creado exitosamente",data);
            });
        })    
    },

    //User's login
    login: function(req,res) {
        const valueBody = req.body;
        let errors = []

        //Validate fields aren't empty
        if (!valueBody.password) {
            errors.push("Falta password");
        }
        if (!valueBody.email) {
            errors.push("Falta email");
        }else{
            if(!validator.validate(valueBody.email)){
                errors.push("Formato de email invalido");
            }
        }
        //If fields are empty, send error
        if (errors.length) {
            messages.answer(res.status(400),errors.join(", "),null);
        }else{
            //Query to verify if email exist in the table user and params to execute the query
            const sql = "SELECT * FROM user where email = ?"

            //Execute query
            db.get(sql, valueBody.email, (err, row) => {
                if (err) {
                    messages.answer(res.status(400),err.message,null);
                    return;
                }else{
                    //If query found a value
                    if(row){
                        //Verify if password in db equal to password in the body
                        bcrypt.compare(valueBody.password, row.password, (err, check) => {
                            if(check){
                                return res.status(200).send({
                                    "message": "Usuario logueado exitosamente",
                                    "token": jwt.createToken(row)
                                })
                            }else{
                                messages.answer(res.status(400),"Datos invalidos",null);
                            }  
                        })
                    }else{
                        messages.answer(res.status(400),"Email no encontrado",null);
                    }
                }
            });
        }
    }
};

module.exports = controller;