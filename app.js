// loading main framework `express`
const express = require('express');
const app = express();

// loading template engine `nunjucks`
const nunjucks = require('nunjucks');

// loading framework required modules
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

// loading URL routing module
const home = require('./routes/home');
const game = require('./routes/game')(app);

// setting server listening port
const port = 10000;

// setting server SSL
/*const SERVER_CONFIG = {
  key:  fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
  };*/

// starting server
const server = app.listen(port);
/*const server = https.createServer(SERVER_CONFIG, app)
  .listen(port,function(){console.log("https done.");} );*/

// loading socket io module
const io = require('socket.io').listen(server);
var charalist={};
io.on('connection',function(socket){
    console.log('---------------------------no fuck------------------');

    socket.on('login',function(data){
        charalist[data.name]={name:data.name,x:data.x,y:20};
        socket.username=data.name;
        socket.emit('login',
                {
                    listdata: JSON.stringify(charalist)
                });
        socket.broadcast.emit('newplayer',
                {
                    name:data.name
                });
    });

    socket.on('move',function(datamove){
        socket.broadcast.emit('move',datamove);
    });

    socket.on('stop',function(datamove){
        socket.broadcast.emit('stop',datamove);
    });

    socket.on('disconnect',function(){
        socket.broadcast.emit('userdis',
                {
                    name:socket.username
                });
    });

    socket.on('playerupdate',function(updata){
        charalist[updata.name].x=updata.x;
        charalist[updata.name].y=updata.y;
        //console.log(updata.name,updata.x,updata.y);
        socket.broadcast.emit('playerupdate',updata);
    });
});

// setting framework module `express`
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setting template engine `nunjucks`
nunjucks.configure(
    path.join(__dirname, 'views'), //views path
    // detail setting
    {
        autoescape: true,//auto html escape
        express: app //using express framework
    }
);

// setting template files extentions to `.html`
app.set('view engine', 'html');

// making io module visible to other router module
app.use(function(req, res, next){
    req.io = io;
    next();
});

// setting URL routing module
app.use('/home', home);
app.use('/game', game);
app.use('/', function(req,res,next){ res.redirect('/home'); });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
