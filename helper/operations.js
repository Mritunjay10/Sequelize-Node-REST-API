const logger = require("./indiLogger");
const Logger = logger.Logger;
const errors = [];
const uniqueErrors = [];

exports.returnErrors = (err) => {

    Array.from(err).forEach(function(item) {

        errors.push(item.msg)
    });

    for(let i in errors){
        if(uniqueErrors .indexOf(errors[i]) === -1){
            uniqueErrors.push(errors[i]);
        }
    }

    return uniqueErrors;
};

exports.returnError = (error) => {

    return {error:error, result:{}};
};

exports.returnSuccess = (data) => {

    return {error:"NO_ERROR", result:data};
};

exports.randomNumber = (length)=>{

    let add = 1, max = 12 - add;

    if ( length > max ) {
        return generate(max) + generate(length - max);
    }

    max        = Math.pow(10, length+add);
    let min    = max/10;
    let number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add);
};

exports.writeInfoLog = (message)=>{

    Logger.info(JSON.stringify(message));
};

exports.writeDebugLog = (message)=>{

    Logger.debug(JSON.stringify(message));
};

exports.writeErrorLog = (message)=>{

    Logger.error(JSON.stringify(message));
};
