module.exports = function(app){

const express = require('express');
const session = require('express-session');
const io = require("./socket")(app.server);
const router = express.Router();

/*
app.use('/game',session({
  secret : 'dkwqhnfqwohfwnfuqha',
  resave : false,
  saveUninitialized : true,
}));
*/

router.get('/', UrlSetting, function(req, res, next) {
    res.render('game/index');
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
