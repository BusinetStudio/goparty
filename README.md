# PartyApp Documentación

Documentación del webservices para partyapp

## Usuario

### Schema de usuarios
```
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
  servicios: [], //Arreglo de servicios ofrecidos
  tipoFiestas: [],  //Arreglo de tipo de fiestas ofrecias
  popupCheckForm: {type: Boolean, default:true}, //Popup de informacion aceptado
  popupInputMesagge: {type: Boolean, default:true} //Popup de informacion aceptado
```
### Rutas

POST: __##url del host##__/api/users/login //Login
{username:"nombre de usuario",password:"password"}

POST: __##url del host##__/api/users/ //Registro
{"... datos obligatorios a insertar del schema"}

POST: __##url del host##__/api/users/update //actualizar datos
{_id:"id del usuario", "... datos a actualizar del schema"}


## Eventos

### Schema de eventos
```
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
  servicios_solicitados: [], //Lista de servicios solicitados
  servicios: [] //Arreglo de servicios solicitados con detalles
```
### Rutas

POST: __##url del host##__/api/eventos/getFiestas
{ id_usuario: "id del usuario" }

POST: __##url del host##__/api/eventos/getFiestaById
{ _id: "id de la fiesta a consultar"}

POST: __##url del host##__/api/eventos/nuevaFiesta
{"... datos obligatorios del schema"}

POST: __##url del host##__/api/eventos/borrarFiesta
{ _id: "id de la fiesta a borrar"}


## Cotizaciones

### Schema de cotizaciones
```
  id_usuario: {type: String, required: [true, "can't be blank"]},
  id_proveedor: {type: String, required: [true, "can't be blank"]},
  id_evento: {type: String, required: [true, "can't be blank"]},
  aceptada: Boolean,
  fecha_de_cotizacion: {type: String, required: [true, "can't be blank"]},
  cotizacion : []
```
### Rutas

POST: __##url del host##__/api/cotizaciones/getCotizaciones
{ id_proveedor: "id del proveedor" }

POST: __##url del host##__/api/cotizaciones/getCotizacionByEvento
{ id_usuario: "id del usuario", id_evento: "id de la fiesta" }

POST: __##url del host##__/api/cotizaciones/getCotizacionById
{ _id: "id de la cotizacion" }

POST: __##url del host##__/api/cotizaciones/aceptarCotizacion
{ _id: "id de la cotizacion" }

POST: __##url del host##__/api/cotizaciones/nuevaCotizacion
{"... datos obligatorios del schema"}

POST: __##url del host##__/api/cotizaciones/borrarCotizacion
{ _id: "id de la cotizacion" }




