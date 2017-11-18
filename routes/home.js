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
        homeindex: '/home',
        homeabout: '/home/about',
        title: 'SuperMarios'
    };
    next();
}

module.exports = router;