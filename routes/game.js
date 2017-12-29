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
    if(sess.userName === undefined)
    {
        res.redirect('/game/name');
    }
    else
    {
        res.render('game/index',{ name : sess.userName });
    }
});
    
router.get('/name', UrlSetting,function(req,res,next){
    var sess = req.session;
    if(sess.userName)
    {
        res.send('You should not see this page.');
    }
    else
    {
        res.render('game/name',{ error: false });
    }
});

router.post('/name', UrlSetting,function(req,res,next){
    var sess = req.session;
    if(io.playerList[req.body.account])
    {
        res.render('game/name',{ error: true });
    }
    else
    {
        console.log(req.body.account);
        sess.userName = req.body.account;
        res.redirect('/game');
    }
});

router.get('/pedia', UrlSetting, function(req, res, next){
    res.render('game/pedia');
});

router.get('/error', UrlSetting, function(req, res, next){
    res.render('game/error',{ error: 'multipleConnect' });
});

function UrlSetting(req,res,next){
    res.locals = {
        title: 'SuperMarios',
        root: '/',
        home: '/home',
        game: '/game',
        pedia: '/game/pedia',
    };
    next();
}

return router;

};
