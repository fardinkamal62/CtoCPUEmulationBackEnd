const express = require('express');
const router = express.Router();

const api = require('../api');

router.get('/', function (req, res) {
    api.emulate(req, res);
});

router.post('/', function (req, res) {
    api.emulate(req, res);
});

module.exports = router;
