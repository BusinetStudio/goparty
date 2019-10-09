# PartyApp Documentación

Documentación del webservices para partyapp

## Usuario

### Schema de usuarios
```
  username: {type: String, lowercase: true, unique: true, required: [true, "no puede estar vacio"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "no puede estar vacio"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  privilege: {type: String, default: 'Usuario', enum: ['Usuario', 'Admin', 'Proveedor'] },
  hash: String,
  salt: String,
```
### Rutas

POST: __##url del host##__/api/users/login 

{username:"nombre de usuario",password:"password"}

POST: __##url del host##__/api/users/

{"... datos obligatorios a insertar del schema"}

POST: __##url del host##__/api/users/update

{_id:"id del usuario", "... datos a actualizar del schema"}

### Schema de perfiles usuarios
```
  id_usuario: {type: String, required: [true, "no puede estar vacio"], unique: true,},
  image: {type: String, default: '/images/smiley-cyrus.jpg'},
  nombreCompleto: String,
  fechaNacimiento: String,
  genero: {type: String, enum: ['Femenino', 'Masculino']},
  telefono: String,
  celular: String,
  direccion: String,
  distrito: String,
  popupCheckForm: {type: Boolean, default:true},
  popupInputMesagge: {type: Boolean, default:true}
```
### Rutas
POST: __##url del host##__/api/users/usuarioProfileUpdate

{id_usuario:"id del usuario", "... datos a actualizar del schema"}


### Schema de perfiles Proveedores
```
  id_proveedor: {type: String, required: [true, "no puede estar vacio"], unique: true,},
  image: {type: String, default: '/images/smiley-cyrus.jpg'},
  nombreEmpresa: String,
  ruc: String,
  telefonoEmpresa: String,
  direccionEmpresa: String,
  distritoEmpresa: String,
  servicios: [],
  tipoFiestas: []
```
### Rutas
obtener perfil del proveedor
POST: __##url del host##__/api/users/proveedorProfile

{id_proveedor :"id del proveedor"}

actualizar perfil proveedor
POST: __##url del host##__/api/users/proveedorProfileUpdate

{id_proveedor :"id del proveedor", "... datos a actualizar del schema"}



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




