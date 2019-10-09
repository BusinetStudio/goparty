var mongoose = require('mongoose');

var EventosSchema = new mongoose.Schema({
  id_usuario: {type: String, required: [true, "can't be blank"]},
  nombre: {type: String, required: [true, "can't be blank"]},
  fecha_del_evento: {type: String, required: [true, "can't be blank"]},
  hora_del_evento:{type: String, required: [true, "can't be blank"]},
  local: {type: Boolean, required: [true, "can't be blank"]},
  direccion: String,
  distrito: String,
  multiple_local: [],
  adultos: {type: Number, required: [true, "can't be blank"]},
  ninos: {type: Number, required: [true, "can't be blank"]},
  categoria:{type: String, required: [true, "can't be blank"]},
  servicios_solicitados: [],
  servicios: []
}, {timestamps: true});
mongoose.model('Eventos', EventosSchema);