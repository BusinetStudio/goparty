var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
// =====================================
// HOME PAGE (with login links) ========
// =====================================

router.get('/',isLoggedIn, function(req, res) {
	res.render('dashboard.ejs',{
		usuario: req.user
	}); 
});
router.get('/login', function(req, res) {
	res.render('login.ejs',{
		message: req.flash('message') 
	}); 
});
router.post('/login', function(req, res, next){
  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
  })(req, res, next);
});
router.get('/registro', function(req, res) {
	res.render('registro.ejs',{
		message: ''
	}); 
});
router.post('/registro', function(req, res, next){
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save().then(function(){
    return res.redirect('/');
  }).catch(next);
});

router.use('/usuarios', isAdmin, require('./usuarios'));
router.use('/cuenta', isLoggedIn, require('./cuenta'));
router.use('/api', require('./api'));



// Middlewares
function isAdmin(req, res, next){
	if (req.isAuthenticated() && req.user.privilege == 'Admin') {return next();}
	else {return res.redirect('/')}; 
}
function isUsuario(req, res, next){
	if (req.isAuthenticated() && req.user.privilege == 'Usuario') {return next();}
	else {return res.redirect('/')}; 
}
function isProveedor(req, res, next){
	if (req.isAuthenticated() && req.user.privilege == 'Proveedor') {return next();}
	else {return res.redirect('/')}; 
}
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {return next();}
	else {return res.redirect('/login')}; 
}

module.exports = router;