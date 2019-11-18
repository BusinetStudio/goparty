var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('Usuarios');
var UsuariosInfo = mongoose.model('UsuariosInfo');
var ProveedoresInfo = mongoose.model('ProveedoresInfo');
var auth = require('./auth');
var crypto = require('crypto');
var ubigeo = require('../datos/peruGeo/distritos.json');
var distritos = ubigeo['3927'];
  
router.get('/todos', function(req, res, next){
  User.find().then(function(users){
    if(!users){ return res.sendStatus(401); }
    return res.render('usuarios/todos.ejs', { 
      usuarios: users,
      usuario: req.user
    }); // load the index.ejs file
  }).catch(next);
});
router.get('/editar/:id', async function(req, res, next){
  var user = await User.findById(req.params.id);
  if(user.privilege==='Usuario'){
    var profile = await UsuariosInfo.findOne({id_usuario: req.params.id});
    return res.render('usuarios/editar.ejs', { 
      usuario: req.user,
      user: user,
      profile: profile,
      distritos: distritos,
    });
  }else if(user.privilege==='Proveedor'){
    var profile = await ProveedoresInfo.findOne({id_usuario: req.params.id});
    return res.render('usuarios/editar.ejs', { 
      usuario: req.user,
      user: user,
      profile: profile,
      distritos: distritos,
    });
  }
});
router.post('/editar/', function(req, res, next) {
  User.findById(req.body._id, async function(err, result) {
    var id = { '_id':req.body._id };
    var data= new Object;
    var profile = new Object;
    for(key in req.body){
      if(key!='_id'){
        if(key === 'username' || key === 'email' || key=== 'password') data[key] = req.body[key];
      }
    }
    for(key in req.body.profile){profile[key] = req.body.profile[key];}
    if(req.body.password){
      var salt = result.salt;
      var hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 512, 'sha512').toString('hex');
      data["hash"] = hash;
    }
    try{
      var updateUser = await User.findByIdAndUpdate(id, data).exec();
      var profileId = updateUser._id;
    } catch(e) {
      console.log('error',e)
      return res.json({valid: false, msg: e.message})
    }
    var ProveedorInfo = await ProveedoresInfo.findByIdAndUpdate(profileId, profile).exec();
    if(!ProveedorInfo){return res.json({valid: false, msg: 'Error'})}
    return res.json({valid: true})
    
  })
});
router.get('/nuevo', function(req, res) {
	res.render('usuarios/nuevo.ejs',{
    usuario: req.user,
    distritos: distritos,
  }); // load the index.ejs file
});
router.post('/nuevo', async function(req, res, next){
  var user = new User();
  var data = req.body
  if(data.username && data.email && data.privilege && data.password){
    var find = await User.findOne({$or: [{username: data.username}, {email: data.email}]}).exec()
    if(find){return res.json({valid:false, msg: 'Usuario o correo en uso.'})}
    user.username = data.username
    user.email = data.email 
    user.privilege = data.privilege
    user.password = data.password
    user.setPassword(data.password);
    user.save(function(err, response){
      if(err) {console.log(err); return res.json({valid:false});}
      if(data.privilege === 'Usuario'){
        var profile = new UsuariosInfo();
        if(data.profile){
          for(key in data.profile){
            profile[key] = data.profile[key];
          }
        }
        profile.id_usuario = response._id;
        profile.save(function(err, response){
          if(err)console.log(err)
          return res.json({valid: true})
        })
      }else if(data.privilege === 'Proveedor'){
        var profile = new ProveedoresInfo();
        if(data.profile){
          for(key in data.profile){
            profile[key] = data.profile[key];
          }
        }
        profile.id_proveedor = response._id;
        profile.save(function(err, response){
          if(err)console.log(err)
          return res.json({valid: true})
        })
      }
    });
  }else{
    return res.json({valid:false, msg: 'Campos vacios'})
  }
});

router.get('/borrar/:id', function(req, res, next){
  User.deleteOne({ _id: req.params.id }, function (err) {
    if(err) console.log(err);
    return res.redirect('/usuarios/todos/');
  });
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