module.exports = function(app){

const express = require('express');
const session = require('express-session');
const io = require("./socket")(app.server);
const router = express.Router();

app.use('/game',session({
  secret : 'dkwqhnfqwohfwnfuqha',
  resave : false,
  saveUninitialized : true,
}));

router.get('/', UrlSetting, function(req, res, next) {
    var sess = req.session;
    if(sess.userName != undefined ) res.render('game/index',{ name : sess.userName });
    else res.redirect('/game/name');
});
    
router.get('/name', UrlSetting,function(req,res,next){
    res.render('game/name');
});

router.post('/name', UrlSetting,function(req,res,next){
    var sess = req.session;
    sess.userName = req.body.account;
    res.redirect('/game');
});
    
router.get('/pedia', UrlSetting, function(req, res, next) {
    res.render('game/pedia');
});

function UrlSetting(req,res,next){
    res.locals = {
        title: 'SuperMarios',
        home: '/home',
        game: '/game',
        pedia: '/game/pedia',
    };
    next();
}

return router;

};
