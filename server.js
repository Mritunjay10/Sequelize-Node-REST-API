const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const PORT = process.env.PORT || 81;

const expressValidator = require('express-validator');
const expFileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const AuthController = require('./controller/auth.controller');

const opr = require('./helper/operations');
const user = require('./routes/user');
const userType = require('./routes/user_type');
const clientType = require('./routes/client_type');

app.use(expressValidator());
app.use(expFileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'REST-API', saveUninitialized: false, resave: false}));


app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {

        const method = req.body._method;
        delete req.body._method;
        return method
    }
}));

const token = (req, res, next)=>{

    AuthController.getAuthToken(req,res,next);
};

const auth = (req, res, next)=>{

    AuthController.verifyAuth(req, res, next);
};

app.all('/', token,(req, res) => res.status(200).send(opr.returnSuccess(req.auth)));

app.use('/v1/user', auth, user);

app.use('/v1/user_type', auth, userType);

app.use('/v1/client_type', auth, clientType);

app.all('/test', (req, res)=> res.status(403).send(opr.returnSuccess("HERE")));

server.listen(PORT, () => console.log(`REST-API Port running on ${PORT}!`));
