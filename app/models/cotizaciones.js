var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../../config').secret;

var CotizacionesSchema = new mongoose.Schema({
  id_usuario: {type: String, required: [true, "can't be blank"]},
  id_proveedor: {type: String, required: [true, "can't be blank"]},
  id_evento: {type: String, required: [true, "can't be blank"]},
  aceptada: Boolean,
  fecha_de_cotizacion: {type: String, required: [true, "can't be blank"]},
  cotizacion : []
}, {timestamps: true});
mongoose.model('Cotizaciones', CotizacionesSchema);