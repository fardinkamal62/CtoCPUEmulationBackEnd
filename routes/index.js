const express = require('express');
const router = express.Router();

const api = require('../api');

router.post('/', function (req, res) {
    api.emulate(req, res);
});

router.use((req, res) => {
    res.status(404).json({code: 404, error: 'Not Found'});
})

module.exports = router;
