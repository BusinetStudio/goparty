var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var auth = require('./auth');
var crypto = require('crypto');
  
router.get('/todos', function(req, res, next){
  User.find().then(function(users){
    if(!users){ return res.sendStatus(401); }
    return res.render('usuarios/todos.ejs', { 
      usuarios: users,
      usuario: req.user
    }); // load the index.ejs file
  }).catch(next);
});
router.get('/editar/:id', function(req, res, next){
  User.findById(req.params.id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    return res.render('usuarios/editar.ejs', { 
      usuario: user
    }); // load the index.ejs file
  }).catch(next);
});
router.post('/editar/', function(req, res, next) {
  User.findById(req.body._id, function(err, result) {
    var query = { '_id':req.body._id };
    var datos = req.body;
    if(req.body.password){
      var salt = result.salt;
      var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
      datos["hash"] = hash;
    }
    User.findByIdAndUpdate( query,datos,{new: true},
      (err2, todo) => {
        if (err2) return res.status(500).send(err2);
        res.redirect('/usuarios/todos/');
      }
    )
  })
});
router.get('/nuevo', function(req, res) {
	res.render('usuarios/nuevo.ejs',{
    usuario: req.user
  }); // load the index.ejs file
});
router.post('/nuevo', function(req, res, next){
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save().then(function(){
    return res.redirect('/usuarios/todos');
  }).catch(next);
});



//Configuring app to have sessions 
passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    if(err) return res.status(500).send(err);
    if(user) done(err, user);

  })
})
module.exports = router;