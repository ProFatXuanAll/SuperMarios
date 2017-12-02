const express = require('express');
const router = express.Router();

router.get('/', UrlSetting, function(req, res, next) {
    res.render('game/index');
});

router.get('/pedia', UrlSetting, function(req, res, next) {
    res.render('game/pedia');
});

router.get('/login', UrlSetting, function(req, res, next) {
    res.render('game/login');
});

router.post('/login', UrlSetting, function(req, res, next) {
    res.send(req.body);
});

router.get('/regist', UrlSetting, function(req, res, next) {
    res.render('game/regist');
});

function UrlSetting(req,res,next){
    res.locals = {
        title: 'SuperMarios',
        home: '/home',
        game: '/game',
        pedia: '/game/pedia',
        login: '/game/login',
        regist: '/game/regist'
    };
    next();
}

module.exports = router;
