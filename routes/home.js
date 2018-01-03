const express = require('express');
const router = express.Router();

router.get('/', UrlSetting, function(req, res, next) {
    res.render('home/home');
});

router.get('/about', UrlSetting, function(req, res, next) {
    res.render('home/about');
});

function UrlSetting(req, res, next){
    res.locals = {
        root: '/',
        home: '/home',
        about: '/home/about',
        game:  '/game',
        title: 'SuperMarios'
    };
    next();
}

module.exports = router;
