const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const model = require('/models/game_model');
const router = express.Router();

const url = `mongodb://${config.mongo.user}:${config.mongo.password}@localhost:27017/${config.mongo.dbname}`

mongoose.connect(url, { useMongoClient: true }, (err, res) => {
  if (err) console.log('MongoDB connected failed');
  else console.log('MongoDB connected success');
});
mongoose.Promise = global.Promise;


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
    var act = req.body.account;
    var pwd = req.body.password;
    model.user.findOne({ 'account' : act }, 'password', function(err,user){
        if(err || user.password != pwd){
            console.log('login error');
            res.send('Login error');
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
    res.render('game/regist');
});

router.post('/regist', UrlSetting, function(req, res, next) {
    var act = req.body.account;
    var pwd = req.body.password;

    const newUser = new model.user({
        account : act,
        password : pwd,
    });

    newUser.save(function(err){
        if(err){
            console.log('regist failed');
            res.send('regist failed');
        }
        else{
            console.log('regist success');
            res.render('game/redirect',{
                fromLogin : false,
                fromRedirect : true,
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

module.exports = router;