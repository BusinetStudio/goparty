var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var auth = require('../auth');

router.get('/user', auth, function(req, res, next){
  console.log(req.user)
  User.findById(req.user.id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.put('/user', auth, function(req, res, next){
  User.findById(req.user.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.bio !== 'undefined'){
      user.bio = req.body.user.bio;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/users/login', function(req, res, next){
  passport.authenticate('app', {
    session: false,
    badRequestMessage: 'Debe rellenar todos los campos.'
  }, function(err, user, info){
    if(!user || err){ 
      return res.json({success : false, info: info, error: err}); 
    } 
    user.token = user.generateJWT();
    return res.json({success : true, user: user.toAuthJSON()});
  })(req, res, next);
});
router.post('/users/update', function(req, res, next){
  var query = { '_id':req.body.id };
  var datos = req.body;
  delete datos.id
  User.findOneAndUpdate( query,datos,{new: true, useFindAndModify: false},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      else res.json({status: 'actualizado'})
      
    }
  )

});
router.post('/users', function(req, res, next){
  var user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.nombreCompleto = req.body.nombreCompleto;
  user.direccion = req.body.direccion;
  user.distrito = req.body.distrito;
  user.telefono = req.body.telefono;
  user.setPassword(req.body.password);

  user.save().then(function(){
    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

module.exports = router;