const db = require('../models');
const opr = require('../helper/operations');
const AuthTokens = db.auth_tokens;
const User = db.users;
const UserType = db.user_type;

exports.getAuthToken = (req, res, next)=>{

    req.assert('user_type', 'Invalid parameter').notEmpty();
    req.assert('user_auth', 'Invalid parameter').notEmpty();

    const errors = req.validationErrors();

    if(!errors){

        this.getUserAuth(req, res).then((user)=>{

            if(user.id>0){

                AuthTokens.findOne({

                    where:{
                        user_id: user.id
                    }

                }).then((result=>{

                    req.auth = result;
                    req.user = user.id;
                    next();

                })).catch((err)=>{

                    opr.writeErrorLog(err);

                    res.status(503).send(opr.returnError("FAILED_TO_GET_TOKEN"));
                })
            }
            else {

                res.status(403).send(opr.returnError("NO_SUCH_USER"));
            }
        });
    }
    else {

        res.status(400).send(opr.returnError("INVALID_PARAMETERS"));
    }
};

exports.getUserAuth = (req,res) =>{

    req.assert('user_type', 'Invalid parameter').notEmpty();
    req.assert('user_auth', 'Invalid parameter').notEmpty();

    const errors = req.validationErrors();

    if(!errors){

        return User.findOne({

            where:{
                user_phone: req.body.user_auth
            }
        }).then((data)=>{

            return data;
        })
    }
    else {

        res.status(422).send(opr.returnError("INVALID_PARAMETERS"));
    }
};

exports.verifyAuth = (req,res, next) =>{

    if(req.headers["auth-token"]!=null && req.headers["auth-token"].length>30){

        AuthTokens.findOne({
            where:{
                token:req.headers["auth-token"]
            }
        }).then(result=>{

            if(result.id>0){

                req.auth = result;
                next()

            }
            else {

                res.status(403).send(opr.returnError("INVALID_AUTH_TOKEN"));
            }
        }).catch((error)=>{

            opr.returnError(error);

            res.status(503).send(opr.returnError("ERROR_WHILE_FETCHING_DATA"));
        })
    }
    else {

        res.status(422).send(opr.returnError("INVALID_PARAMETERS"));
    }
};