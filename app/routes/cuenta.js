var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var auth = require('./auth');
var crypto = require('crypto');
  
router.get('/perfil', function(req, res, next){
  User.findById(req.user._id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    if(user.privilege=='Usuario'){
      return res.render('cuenta/perfil-usuarios.ejs', { 
        usuario: user
      }); 
    }else if (user.privilege=='Proveedor'){
      return res.render('cuenta/perfil-proveedores.ejs', { 
        usuario: user
      }); 
    }else if (user.privilege=='Admin'){
      return res.render('cuenta/perfil-admins.ejs', { 
        usuario: user
      }); 
    }
  }).catch(next);
});
router.post('/perfil', function(req, res, next) {
  var query = { '_id':req.user._id };
  var datos = req.body;
  User.findByIdAndUpdate( query,datos,{new: true},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      res.redirect('/cuenta/perfil');
    }
  )
});

router.get('/cambiar-contrasena', function(req, res, next){
  User.findById(req.user._id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    return res.render('cuenta/cambiar-contrasena.ejs', { 
      usuario: user
    }); 
  }).catch(next);
});

router.post('/cambiar-contrasena', function(req, res, next){
  var query = { '_id':req.user._id };
  var salt = req.user.salt;
  var password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
  User.findByIdAndUpdate( query,{hash: password},{new: true},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      res.redirect('/');
    }
  )
});




router.get('/salir', function(req, res, next){
  req.logout();
  res.redirect('/login');
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