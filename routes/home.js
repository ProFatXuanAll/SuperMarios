var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'SuperMarios' });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

/*router.get('/', function(req,res,next){ 
    return res.redirect('/home/index');
});*/


module.exports = router;