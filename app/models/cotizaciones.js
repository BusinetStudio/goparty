var mongoose = require('mongoose');

var CotizacionesSchema = new mongoose.Schema({
  id_usuario: {type: String, required: [true, "can't be blank"]},
  id_proveedor: {type: String, required: [true, "can't be blank"]},
  id_evento: {type: String, required: [true, "can't be blank"]},
  aceptada: Boolean,
  fecha_de_cotizacion: {type: String, required: [true, "can't be blank"]},
  servicios:[],
  cotizacion : {},
  total: Number
}, {timestamps: true});
mongoose.model('Cotizaciones', CotizacionesSchema);