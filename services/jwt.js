'use strict'

//Requires
var jwt = require("jwt-simple");
var moment = require("moment");

exports.createToken = function(user){
    
    var payload = {
        //user data for token
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        //Token create date
        dcr: moment().unix(),
        //Token expire date
        exp: moment().add(30, "minutes").unix
    };

    return jwt.encode(payload, "$2a$05$LhayLxezLhK1LhWvKxCyLOj0j1u.Kj0jZ0pEmm134uzrQlFvQJLF6");
};