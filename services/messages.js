'use strict'

exports.answer = function(res,message,data){

    if (data == null){
        return res.send({
            "message": message
        })
    }else{
        return res.send({
            "message": message,
            "data": data
        })
    }
};