var mongoose = require('mongoose');

var ProveedoresInfoSchema = new mongoose.Schema({
  id_proveedor: {type: String, required: [true, "no puede estar vacio"], unique: true,},
  image: {type: String, default: '/images/smiley-cyrus.jpg'},
  nombreEmpresa: String,
  ruc: String,
  telefonoEmpresa: String,
  direccionEmpresa: String,
  distritoEmpresa: String,
  servicios: [],
  tipoFiestas: []
}, {timestamps: true});



mongoose.model('ProveedoresInfo', ProveedoresInfoSchema);