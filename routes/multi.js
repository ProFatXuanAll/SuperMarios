module.exports = function(app){

const express = require('express');
const router = express.Router();

router.get('/', UrlSetting, function(req, res, next) {
    res.render('game/index',{ userName : "fuck" });
});

router.get('/pedia', UrlSetting, function(req, res, next) {
    res.render('game/pedia');
});

/*router.get('/login', UrlSetting, function(req, res, next) {
    res.render('game/login',{ noLogin : true, error : false});
});

router.post('/login', UrlSetting, function(req, res, next) {
    var act = req.body.account;
    var pwd = req.body.password;
    var sess = req.session;
    model.user.findOne({ 'account' : act, 'password' : pwd }, "account", function(err,user){
        if( user === null ){
                console.log('login error');
                res.render('game/login',{ noLogin : true, error : true});
        }
        else{
            console.log('login success : ' + user.account);
            sess.userName = act;
            res.render('game/redirect',{
                noLogin : false,
                fromLogin : true,
                fromRegist : false,
                userName : act,
            });
        };
    });
});

router.get('/regist', UrlSetting, function(req, res, next) {
    var sess = req.session;
    if(sess.userName){
        res.redirect('/game',{ noLogin : false, userName : sess.userName });
    }
    else res.render('game/regist',{ noLogin : true, error : false });
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
            res.render('game/regist',{ noLogin : true, error : true });
        }
        else{
            console.log('regist success');
            res.render('game/redirect',{
                noLogin : true,
                fromLogin : false,
                fromRegist : true,
                userName : act,
            });
        };
    });
});

router.get('/logout', UrlSetting, function(req, res, next) {
    req.session.destroy();
    res.redirect('/game/login');
});
*/

function UrlSetting(req,res,next){
    res.locals = {
        title: 'SuperMarios',
        home: '/home',
        game: '/game',
        pedia: '/game/pedia',
        login: '/game/login',
        logout: '/game/logout',
        regist: '/game/regist',
        user : '/game/user',
        nologin : true,
    };
    next();
}

return router;

};
