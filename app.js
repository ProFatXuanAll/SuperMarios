/* main framework : `express`       *
 * template engine : `nunjucks`     *
 * connection module : `socket.io`  */
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');

// loading framework required modules
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

// setting server listening port
const config = require('./config');
const port = config.port;

// setting server SSL
/*const SERVER_CONFIG = {
    key:  fs.readFileSync('ssl/private.key'),
    cert: fs.readFileSync('ssl/certificate.crt')
};*/

// starting server
app.server = app.listen(port);
/*app.server = https.createServer(SERVER_CONFIG, app)
  .listen(port,function(){console.log("https done.");} );*/

// loading URL routing module
const home = require('./routes/home');
const game = require('./routes/game')(app);

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

// setting URL routing module
app.use('/home', home);
app.use('/game', game);
app.use('/', function(req, res, next){
    res.render(
        'home/index',
        {
            game: '/game'
        }
    );
});

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
