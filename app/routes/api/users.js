var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var auth = require('../auth');
var UsuariosInfo = mongoose.model('UsuariosInfo');
var ProveedoresInfo = mongoose.model('ProveedoresInfo');

router.post('/users/login', function(req, res, next){
  passport.authenticate('app', {
    session: false,
    badRequestMessage: 'Debe rellenar todos los campos.'
  }, async function(err, user, info){
    if(!user || err){ 
      return res.json({success : false, info: info, error: err}); 
    } 
    user.token = user.generateJWT();
    var datosUsuario=user.toAuthJSON();
    console.log(datosUsuario)
    if(datosUsuario.privilege === 'Usuario'){
      var profile = await UsuariosInfo.findOne({id_usuario: datosUsuario.id});
      return res.json({success : true, user: datosUsuario, profile: profile});
    }else if(datosUsuario.privilege === 'Proveedor'){
      var profile = await ProveedoresInfo.findByOne({id_proveedor: datosUsuario.id});
      return res.json({success : true, user: datosUsuario, profile: profile});
    }
    return res.json({success : false});
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
router.post('/users', async function(req, res, next){
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.privilege = 'Usuario';
  user.setPassword(req.body.password);
  var dataUser = await user.save();

  var profile = new UsuariosInfo();
  profile.id_usuario = dataUser._id;
  profile.nombreCompleto = req.body.nombreCompleto;
  profile.direccion = req.body.direccion;
  profile.distrito = req.body.distrito;
  profile.telefono = req.body.telefono;
  var dataProfile = await profile.save();

  console.log(dataProfile)
  return res.json({user: user.toAuthJSON(), profile: dataProfile});
});

router.post('/users/usuarioProfileUpdate', function(req, res, next){
  var query = { 'id_usuario':req.body.id };
  var datos = req.body;
  delete datos.id_usuario
  UsuariosInfo.findOneAndUpdate( query,datos,{new: true, useFindAndModify: false},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      else res.json({status: 'Actualizado'})
    }
  )
});
router.post('/users/proveedorProfileUpdate', function(req, res, next){
  var query = { 'id_proveedor':req.body.id };
  var datos = req.body;
  delete datos.id_proveedor
  User.findOneAndUpdate( query,datos,{new: true, useFindAndModify: false},
    (err2, todo) => {
      if (err2) return res.status(500).send(err2);
      else res.json({status: 'Actualizado'})
      
    }
  )

});

router.post('/users/proveedorProfile', function(req, res, next){
  ProveedoresInfo.findOne({id_proveedor: req.body.id_proveedor},
    (err, resp) => {
      if (err) return res.status(500).send(err);
      else res.json({success: true, data: resp})
    }
  )
});

router.post('/users/proveedorPuntuar', async function(req, res, next){
  var info = await ProveedoresInfo.findOne({id_proveedor: req.body.id_proveedor});
  var puntaje = ( (info.puntaje * info.numPuntuados) + req.body.puntaje ) / (info.numPuntuados + 1);
  var numPuntuados = numPuntuados + 1;
  ProveedoresInfo.findOneAndUpdate(
    {id_proveedor: req.body.id_proveedor},
    {puntaje: puntaje, numPuntuados: numPuntuados},
    (err, resp) => {
      if (err) return res.status(500).send(err);
      else res.json({success: true, data: resp})
    }
  )
});

module.exports = router;