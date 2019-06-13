const express = require('express');
const router  = express.Router();

const opr = require('../helper/operations');

const userController = require('../controller/user.controller');

router.post('/', (req, res) => res.status(403).send(
    opr.returnError("INVALID_REQUEST"))
);

router.post('/create', (req, res) => userController.create(req, res));

router.get('/get', (req, res) => userController.getAll(req, res));

router.get('/get/:id', (req, res) => userController.get(req, res));

router.get('/list/:page', (req, res) => userController.getByOffset(req, res));

router.put('/update/:id', (req, res) => userController.update(req, res));

router.delete('/delete/:id', (req, res) => userController.delete(req, res));

module.exports = router;