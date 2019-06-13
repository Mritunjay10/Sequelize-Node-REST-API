const express = require('express');
const router  = express.Router();

const opr = require('../helper/operations');

const userTypeController = require('../controller/user_type.controller');

router.post('/', (req, res) => res.status(403).send(
    opr.returnError("INVALID_REQUEST"))
);

router.post('/create', (req, res) => userTypeController.create(req, res));

router.get('/get', (req, res) => userTypeController.getAll(req, res));

router.get('/get/:id', (req, res) => userTypeController.get(req, res));

router.get('/list/:page', (req, res) => userTypeController.getByOffset(req, res));

router.put('/update/:id', (req, res) => userTypeController.update(req, res));

router.delete('/delete/:id', (req, res) => userTypeController.delete(req, res));

module.exports = router;