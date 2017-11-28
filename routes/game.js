var express = require('express');
var router = express.Router();

router.get('/', UrlSetting, function(req, res, next) {
    res.render('game/index');
});

router.get('/pedia', UrlSetting, function(req, res, next) {
    res.render('game/pedia');
});

router.get('/login', UrlSetting, function(req, res, next) {
    res.render('game/login');
});

function UrlSetting(req,res,next){
    res.locals = {
        title: 'SuperMarios',
        home: '/home',
        game: '/game',
        pedia: '/game/pedia',
        login: '/game/login'
    };
    next();
}

module.exports = router;
