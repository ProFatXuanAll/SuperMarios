var express = require('express');
var router = express.Router();

router.get('/', UrlSetting, function(req, res, next) {
    res.render('home/index');
});

router.get('/about', UrlSetting, function(req, res, next) {
    res.render('home/about');
});

function UrlSetting(req,res,next){
    res.locals = {
        home: '/home',
        about: '/home/about',
        game:  '/game',
        title: 'SuperMarios'
    };
    next();
}

module.exports = router;
