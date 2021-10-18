'use strict'

//Requires
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6"

exports.authenticated = function(req, res, next){
    //If authorization is empty
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "El usuario no está autenticado"
        });
    }

    //Delete quotes
    var token = req.headers.authorization.replace(/['"]+/g,"")

    //Decode token
    try{
        var payload = jwt.decode(token, secret);

        //If token has expired
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: "El token ha expirado"
            });
        }
    }catch(ex){
        return res.status(404).send({
            message: "El token no es valido"
        });
    }

    req.user = payload;
    next();
}