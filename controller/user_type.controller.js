const db = require('../models');
const opr = require('../helper/operations');

const UserType = db.user_type;

exports.create = (req, res) =>{

    req.assert('user_type', 'Invalid user type').notEmpty();

    const errors = req.validationErrors();

    if(!errors){

        UserType.create(
            {user_type: req.body.user_type}
        ).then((data)=>{

            res.status(201).send(opr.returnSuccess(data));

        }).catch((err)=>{

            opr.writeErrorLog(err);
            res.status(503).send(opr.returnError("FAILED_TO_CREATE_USER_TYPE"));
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

        UserType.findOne({
            where:{
                id: req.params.id
            }
        }).then((type)=>{

            res.status(200).send(opr.returnSuccess(type));

        }).catch(e=>{
            opr.writeErrorLog(e);
            res.status(403).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
        });
    }
    else {

        res.status(422).send(opr.returnError("INVALID_PARAMETERS"));
    }
};

exports.getAll = (req, res) => {

    UserType.findAll({

        where:{
            status: 'active'
        }
    }).then(userType=>{

        res.status(200).send(opr.returnSuccess(userType));

    }).catch((err)=>{

        opr.writeErrorLog(err);
        res.status(503).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
    });
};


exports.getByOffset = (req, res) =>{

    req.assert('page', 'Invalid id').notEmpty();

    const errors = req.validationErrors();

    if(!errors && req.params.page>0) {

        UserType.findAll({

            where:{
                status: 'active'
            },
            offset: ((req.params.page)-1)*10,
            limit: 10

        }).then(data=>{

            res.status(200).send(opr.returnSuccess(data));

        }).catch((err)=>{

            opr.writeErrorLog(err);
            res.status(403).send(opr.returnError("FAILED_TO_FETCH_USER_DETAILS"));
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

    UserType.update(
        body,
        { where: { id: req.params.id } }

    ).then((value)=>{

        res.status(200).send(opr.returnSuccess((value)));

    }).catch((err)=>{

        opr.writeErrorLog(err);
        try{
            const error = err.errors[0].message;
            res.status(403).send(opr.returnError(error.replace("_", " ")));
        }
        catch (E){
            res.status(403).send(opr.returnError("FAILED_TO_UPDATE_USER"));
        }
    });

    this.log(req.user, 'user_type', req.body.user_type, 'create');
};

exports.delete = (req, res) => {

    UserType.update(
        {status: 'deleted'},
        { where: { id: req.params.id } }

    ).then((value)=>{

        res.status(200).send(opr.returnSuccess((value)));

    }).catch((err)=>{

        opr.writeErrorLog(err);
        res.status(403).send(opr.returnError("FAILED_TO_UPDATE_USER"));
    })
};
