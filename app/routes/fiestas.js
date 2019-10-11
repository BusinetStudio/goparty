var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var UsuariosInfo = mongoose.model('UsuariosInfo');
var ProveedoresInfo = mongoose.model('ProveedoresInfo');
var Eventos = mongoose.model('Eventos');
var auth = require('./auth');
var crypto = require('crypto');
var ubigeo = require('../datos/peruGeo/distritos.json');
var distritos = ubigeo['3927'];
 
router.get('/', async function(req, res, next){
  var eventos = await Eventos.find();
  for(var key in eventos){
    var nombre_usuario = await UsuariosInfo.findOne({id_usuario: eventos[key]['id_usuario']});
    nombre_usuario = nombre_usuario['nombreCompleto']
    console.log(nombre_usuario)
    eventos[key]['nombre_usuario'] = nombre_usuario;
  }
  res.render('fiestas/index.ejs',{
    usuario: req.user,
    distritos: distritos,
    eventos: eventos
  });
})
router.get('/editar/:id', async function(req, res, next){
  var evento = await Eventos.findById(req.params.id);
  res.render('fiestas/fiesta.ejs',{
    usuario: req.user,
    distritos: distritos,
    evento: evento
  });
})
router.get('/borrar/:id', async function(req, res, next){
  Eventos.deleteOne({ _id: req.params.id });
  return res.redirect('/usuarios/todos/');
})

module.exports = router;