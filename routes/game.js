module.exports = function(app){

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('../config');
const model = require('../models/game_model');
const router = express.Router();

const url = `mongodb://${config.mongo.user}:${config.mongo.password}@localhost:27017/${config.mongo.dbname}`

mongoose.connect(url, { useMongoClient: true }, (err, res) => {
  if (err) console.log('MongoDB connected failed');
  else console.log('MongoDB connected success');
});
mongoose.Promise = global.Promise;

app.use('/game',session({
  secret : 'dkwqhnfqwohfwnfuqha',
  resave : false,
  saveUninitialized : true,
}));

router.get('/', UrlSetting, function(req, res, next) {
    res.render('game/index');
});

router.get('/pedia', UrlSetting, function(req, res, next) {
    res.render('game/pedia');
});

router.get('/login', UrlSetting, function(req, res, next) {
    res.render('game/login',{error : false});
});

router.post('/login', UrlSetting, function(req, res, next) {
    var act = req.body.account;
    var pwd = req.body.password;
    model.user.findOne({ 'account' : act }, 'password', function(err,user){
        if(err || act == "" || user.password != pwd){
                console.log('login error');
                res.render('game/login',{error : true});
        }
        else{
            console.log('login success');
            res.render('game/redirect',{
                fromLogin : true,
                fromRegist : false,
                userName : act,
            });
        };
    });
});

router.get('/regist', UrlSetting, function(req, res, next) {
    res.render('game/regist',{ error : false });
});

router.post('/regist', UrlSetting, function(req, res, next) {
    var act = req.body.account;
    var pwd = req.body.password;

    const newUser = new model.user({
        account : act,
        password : pwd,
    });

    newUser.save(function(err){
        if(err || act == "" || pwd == ""){
            console.log('regist failed');
            res.render('game/regist',{ error : true });
        }
        else{
            console.log('regist success');
            res.render('game/redirect',{
                fromLogin : false,
                fromRegist : true,
                userName : act,
            });            
        };
    });
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

return router;

};
