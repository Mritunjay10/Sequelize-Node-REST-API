const uuid = require('uuid/v4');

const Promise = require('bluebird');
const config = require('../config/config.json');
const db = require('../models');
const opr = require('../helper/operations');
const validator = require('../helper/validator');

const User = db.users;
const UserType = db.user_type;
const AuthToken = db.auth_tokens;

exports.create = (req, res) =>{

    req.assert('user_type', 'Invalid user type').notEmpty();
    req.assert('user_email', 'Invalid user email').isEmail();
    req.assert('user_phone', 'Invalid user phone').isLength({ min: 9, max:15 })
    req.assert('password', 'Invalid password').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        validator
            .checkEmail(req.body.user_email)
            .then(email=>{
                if(email===null){
                    validator
                        .checkPhone(req.body.user_phone)
                        .then(phone=>{

                            if(phone===null){
                                db.sequelize.transaction().then((t) => {

                                    return User.create({
                                            user_type: req.body.user_type,
                                            user_email: req.body.user_email,
                                            user_phone: req.body.user_phone,
                                            password: req.body.password

                                        }, {
                                            transaction: t
                                        }

                                    ).then((user) => {

                                        const token = uuid();

                                        console.log(token);

                                        return AuthToken.create({
                                            user: user.id,
                                            token: token

                                        }, {
                                            transaction: t
                                        }).then((result) =>{

                                            t.commit();
                                            res.status(201).send(opr.returnSuccess(user));

                                        }).catch(err =>{

                                            opr.writeErrorLog(err);
                                            t.rollback();
                                            res.status(503).send(opr.returnError("FAILED_TO_CREATE_TOKEN"));
                                        });

                                    }).catch((error) => {
                                        opr.writeErrorLog(error);
                                        res.status(503).send(opr.returnError("FAILED_TO_CREATE_USER"));
                                    });
                                }).catch((err)=>{
                                    opr.writeErrorLog(err);
                                    res.status(503).send(opr.returnError("FAILED_TO_CREATE_USER"));
                                });
                            }
                            else {
                                res.status(409).send(opr.returnError("PHONE_ALREADY_EXISTS"));
                            }
                        })
                        .catch((e)=>{
                            opr.writeErrorLog(e);
                            res.status(409).send(opr.returnError("FAILED_TO_CREATE_USER"));
                        })
                }
                else {
                    res.status(409).send(opr.returnError("EMAIL_ALREADY_EXISTS"));
                }
            }).catch((e)=>{
                opr.writeErrorLog(e);
                res.status(409).send(opr.returnError("FAILED_TO_CREATE_USER"));
            })

    }
    else {

        res.status(422).send(opr.returnError("INVALID_PARAMETERS"));
    }
};

exports.get = (req, res) =>{

    req.assert('id', 'Invalid id').notEmpty();

    const errors = req.validationErrors();

    if(!errors && req.params.id>0){

        User.findOne({
            where:{
                id:req.params.id,
                status: 'active'
            },
        }).then((userData)=>{

            UserType.findOne({
                where:{
                    id:userData.user_type
                }
            }).then((type)=>{

                userData['user_type'] = type;
                userData['token'] = req.auth;
                res.status(200).send(opr.returnSuccess(userData));

            }).catch(e=>{
                opr.writeErrorLog(e);
                res.status(503).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
            });

        }).catch(e=>{
            opr.writeErrorLog(e);
            res.status(503).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
        });
    }
    else {

        res.status(422).send(opr.returnError("INVALID_PARAMETERS"));
    }
};

exports.getAll = (req, res) => {

    Promise.map(User.findAll({
            where:{
                status: 'active'
            }
        }),
        userData =>{

            let user = userData;

            return UserType.findOne({
                where:{
                    id:user.user_type
                }
            }).then(userType=>{

                user['user_type'] = userType;

                return (user);
            })

    }).then(userType =>{

        res.status(200).send(opr.returnSuccess(userType));

    }).catch((err)=>{

        opr.writeErrorLog(err);
        res.status(503).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
    })

};


exports.getByOffset = (req, res) =>{

    req.assert('page', 'Invalid id').notEmpty();

    const errors = req.validationErrors();

    if(!errors && req.params.page>0) {

        Promise.map(User.findAll({

                where:{
                    status: 'active'
                },
                offset: ((req.params.page)-1)*10,
                limit: 10
            }),
            userData =>{

                let user = userData;

                return UserType.findOne({
                    where:{
                        id:userData.user_type
                    }
                }).then(userType=>{

                    user['user_type'] = userType;

                    return (user);
                })

            }).then(userType =>{

            res.status(200).send(opr.returnSuccess(userType));

        }).catch((err)=>{

            opr.writeErrorLog(err);
            res.status(503).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
        })
    }
    else {

        res.status(422).send(opr.returnError("INVALID_PARAMETERS"));
    }
};

exports.update = (req, res) => {

    let body ={};

    for(let key in req.body) {
        if(req.body.hasOwnProperty(key)){

            body[key] = req.body[key];
        }
    }

    User.update(
        body,
        { where: { id: req.params.id } }

    ).then((value)=>{

        res.status(200).send(opr.returnSuccess((value)));

    }).catch((err)=>{

        opr.writeErrorLog(err);
        try{
            const error = err.errors[0].message;
            res.status(503).send(opr.returnError(error.replace("_", " ")));
        }
        catch (E){
            res.status(503).send(opr.returnError("FAILED_TO_UPDATE_USER"));
        }
    })
};

exports.delete = (req, res) => {

    User.update(
        {status: 'deleted'},
        { where: { id: req.params.id } }

    ).then((value)=>{

        res.status(200).send(opr.returnSuccess((value)));

    }).catch((err)=>{

        opr.writeErrorLog(err);
        res.status(503).send(opr.returnError("FAILED_TO_UPDATE_USER"));
    })
};
