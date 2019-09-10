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
 
POST: __host__/users/login //Login
{username:"nombre de usuario",password:"password"}

POST: __host__/users/ //Registro
{"... datos obligatorios a insertar del schema"}

POST: __host__/users/update //actualizar datos
{_id:"id del usuario", "... datos a actualizar del schema"}


