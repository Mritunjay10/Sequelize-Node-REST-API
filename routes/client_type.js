const express = require('express');
const router  = express.Router();

const opr = require('../helper/operations');

const controller = require('../controller/client_type.controller');

router.any('/', (req, res) => res.status(403).send(
    opr.returnError("INVALID_REQUEST"))
);

router.post('/create', (req, res) => controller.create(req, res));

router.get('/get', (req, res) => controller.getAll(req, res));

router.get('/get/:id', (req, res) => controller.get(req, res));

router.get('/list/:page', (req, res) => controller.getByOffset(req, res));

router.put('/update/:id', (req, res) => controller.update(req, res));

router.delete('/delete/:id', (req, res) => controller.delete(req, res));

module.exports = router;