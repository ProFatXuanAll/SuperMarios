var express = require('express');
var router = express.Router();

router.get('/', UrlSetting, function(req, res, next) {
  res.render('game/index');
});

function UrlSetting(req,res,next){
    res.locals = {
        title: 'SuperMarios'
    };
    next();
}

module.exports = router;
