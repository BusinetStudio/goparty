var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../../config').secret;

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  privilege: {type: String, default: 'Usuario', enum: ['Usuario', 'Admin', 'Proveedor'] },
  image: {type: String, default: '/images/smiley-cyrus.jpg'},

  hash: String,
  salt: String,

  nombreCompleto: String,
  fechaNacimiento: String,
  genero: {type: String, enum: ['Femenino', 'Masculino']},
  telefono: String,
  celular: String,
  direccion: String,
  distrito: String,


  nombreEmpresa: String,
  ruc: String,
  telefonoEmpresa: String,
  direccionEmpresa: String,
  distritoEmpresa: String,

  servicios: [],
  tipoFiestas: [],

  popupCheckForm: {type: Boolean, default:true},
  popupInputMesagge: {type: Boolean, default:true}

}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    nombreCompleto: this.nombreCompleto,
    token: this.generateJWT(),
    image: this.image,
    fechaNacimiento: this.fechaNacimiento,
    genero: this.genero,
    telefono: this.telefono,
    celular: this.celular,
    direccion: this.direccion,
    distrito: this.distrito,
    nombreEmpresa: this.nombreEmpresa,
    popupCheckForm: this.popupCheckForm,
    popupInputMesagge: this.popupInputMesagge
  };
};




mongoose.model('Usuarios', UserSchema);