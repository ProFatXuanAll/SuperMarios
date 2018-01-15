module.exports = function(app){
    const express = require('express');
    const session = require('express-session');
    const io = require("./socket")(app.server);
    const router = express.Router();

    app.use('/game', session({
        secret: 'dkwqhnfqwohfwnfuqha',
        resave: false,
        saveUninitialized: true,
    }));

    router.get('/', UrlSetting, function(req, res, next){
        let sess = req.session;
        if(sess.userName === undefined)
        {
            res.redirect('/game/login');
        }
        else
        {
            res.render(
                'game/index',
                {
                    userName: sess.userName,
                    characterName: sess.characterName
                });
        }
    });
        
    router.get('/login', UrlSetting, function(req, res, next){
        var sess = req.session;
        if(sess.userName)
        {
            // this part should be remove before project release
            res.send('You should not see this page.');
        }
        else
        {
            res.render(
                'game/login',
                {
                    errorMsg: ""
                }
            );
        }
    });

    router.post('/login', UrlSetting, function(req, res, next){
        var sess = req.session;
        if(io.playerList[req.body.account])
        {
            res.render(
                'game/login',
                {
                    errorMsg: "This name have been used, please try another."
                }
            );
        }
        else
        {
            sess.userName = req.body.account;
            sess.characterName = req.body.character;
            res.redirect('/game');
        }
    });

    router.get('/summary', UrlSetting, function(req, res, next){
        // there should be an object "summary" in socket.js, which include sorted players information
        let fakedata = {
            coin: [
                { user: 'player3', achieve: 9, },
                { user: 'player2', achieve: 7, },
                { user: 'player4', achieve: 5, },
                { user: 'player1', achieve: 3, },
                { user: 'player5', achieve: 1, },
            ],
            kill: [
                { user: 'player5', achieve: 16, },
                { user: 'player1', achieve: 13, },
                { user: 'player4', achieve: 12, },
                { user: 'player2', achieve: 9, },
                { user: 'player3', achieve: 6, },
            ],
            comp: [
                { user: 'player4', achieve: 100.0, },
                { user: 'player2', achieve: 97.2, },
                { user: 'player1', achieve: 73.8, },
                { user: 'player5', achieve: 65.5, },
                { user: 'player3', achieve: 20.4, },
            ],
        }                                        
        // summary: io.summary
        res.render('game/summary', { summary: fakedata });
    });

    router.post('/summary', UrlSetting, function(req, res, next){
        req.session.destroy();
        res.redirect('/game/login');
    });

    router.get('/pedia', UrlSetting, function(req, res, next){
        res.render('game/pedia');
    });

    router.get('/error', UrlSetting, function(req, res, next){
        res.render('game/error', { error: 'multipleConnect' });
    });

    function UrlSetting(req, res, next){
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
