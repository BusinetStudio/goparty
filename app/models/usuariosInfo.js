var mongoose = require('mongoose');

var UsuariosInfoSchema = new mongoose.Schema({
  id_usuario: {type: String, required: [true, "no puede estar vacio"], unique: true,},
  image: {type: String, default: '/images/smiley-cyrus.jpg'},
  nombreCompleto: String,
  fechaNacimiento: String,
  genero: {type: String, enum: ['Femenino', 'Masculino']},
  telefono: String,
  celular: String,
  direccion: String,
  distrito: String
}, {timestamps: true});

mongoose.model('UsuariosInfo', UsuariosInfoSchema);