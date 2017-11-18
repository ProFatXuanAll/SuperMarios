var express = require('express');
var router = express.Router();
var home = require('./home');

router.get('/',(req,res) => { res.send('Hello this is testing page'); });

router.use('/test',home);

module.exports = router;