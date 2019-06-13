const db = require('../models');

const User = db.users;


exports.checkEmail = (email) =>{

    return User.findOne({

        where:{
            user_email: email
        }
    }).then((data)=>{

        return data;
    })
};

exports.checkPhone = (phone) =>{

    return User.findOne({

        where:{
            user_phone: phone
        }
    }).then((data)=>{

        return data;
    })
};