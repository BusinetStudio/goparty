const mysql = require('mysql');
const dbconfig = require('../../config/database');
const connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
var bcrypt = require('bcrypt-nodejs');

var usuariosController = {
    nuevo:nuevo,
    editar:editar,
    eliminar:eliminar,
    todos:todos,
    getById: getById,
 }
 
function nuevo(req, res){
    //datos
    var username = req.body.username,
    user_email = req.body.user_email,
    password = bcrypt.hashSync(req.body.password, null, null),
    privilegio = req.body.privilegio;

    //metadatos
    var nombres = req.body.nombres,
    apellidos = req.body.apellidos,
    empresa = req.body.empresa,
    ruc = req.body.ruc,
    genero = req.body.genero,
    fecha_nacimiento = req.body.fecha_nacimiento,
    direccion = req.body.direccion,
    departamento = req.body.departamento,
    provincia = req.body.provincia,
    distrito = req.body.distrito,
    ciudad = req.body.ciudad,
    pais = req.body.pais,
    telefono = req.body.telefono,
    celular = req.body.celular;
    connection.query(`
    INSERT INTO usuarios_metadatos
        (
            nombres,
            apellidos,
            empresa,
            ruc,
            genero,
            fecha_nacimiento,
            direccion,
            departamento,
            provincia,
            distrito,
            ciudad,
            pais,
            telefono,
            celular
        ) VALUES (
            "${nombres}",
            "${apellidos}",
            "${empresa}",
            "${ruc}",
            "${genero}",
            "${fecha_nacimiento}",
            "${direccion}",
            "${departamento}",
            "${provincia}",
            "${distrito}",
            "${ciudad}",
            "${pais}",
            "${telefono}",
            "${celular}"
    )`, 
    function(err, rows){
        var metadatos = rows.insertId;
        connection.query(`
                        INSERT INTO 
                        usuarios ( 
                            username, 
                            user_email, 
                            password, 
                            privilegio, 
                            metadatos
                        ) VALUES (
                            "${username}", 
                            "${user_email}", 
                            "${password}", 
                            ${privilegio}, 
                            ${metadatos}
                        )`,
            function (err2, rows2) {
                if(err2){
                    console.log(err2);
                    if(err2.errno)
                        if(err2.errno == 1062)
                            res.redirect('/usuarios/todos?resp=duplicado');
                    res.redirect('/usuarios/todos');
                }
                if(rows2){
                    res.redirect('/usuarios/todos');
                }
            }
        );
    });
}
function editar(req, res){
    var editar = req.body
    var consulta = '';
    var consultaJson = [];
    consultaJson.push(
        'username = "'+editar.username+'"',
        'dni = "'+editar.dni+'"',
        'email = "'+editar.email+'"',
        'displayName = "'+editar.displayName+'"'
    );
    if(editar.password){
        var password = bcrypt.hashSync(req.body.password, null, null);
        consultaJson.push('password = "'+password+'"');
    }
     if(editar.id_p){
        connection.query('SELECT name FROM privilege WHERE id_p = "'+editar.id_p+'";',
            function (err, rows) {
                consultaJson.push(
                    'id_p ="'+editar.id_p+'"',
                    'privilege ="'+ rows[0].name+'"'
                );
                consultaJson.forEach(function(i, idx, array){
                    consulta += i;
                    if (idx != array.length - 1) consulta += ', '; 
                 });
                connection.query('UPDATE users SET '+ consulta +' WHERE id_u = "'+ editar.id_u +'";',
                    function (err, rows) {
                        if(err){
                            res.redirect('/usuarios/todos');
                        }
                        if(rows){
                            res.redirect('/usuarios/todos');
                        }
                    }
                );
            }
        );
    }else{
        consultaJson.forEach(function(i, idx, array){
            consulta += i;
            if (idx != array.length - 1) consulta += ', '; 
         });
        connection.query('UPDATE users SET '+ consulta +' WHERE id_u = "'+ editar.id_u +'";',
            function (err, rows) {
                if(err){
                    res.redirect('/usuarios/todos');
                }
                if(rows){
                    res.redirect('/usuarios/todos');
                }
            }
        );
    }
}
function getById(req, res){
    connection.query('SELECT * FROM usuarios WHERE id = "'+req+'";', function (err, rows) {
        if(err) throw err;
        if(rows[0].metadatos){
            connection.query('SELECT * FROM usuarios INNER JOIN usuarios_metadatos ON usuarios.metadatos=usuarios_metadatos.id_metadatos WHERE usuarios.id = "'+req+'";', function (err2, rows2) {
                if(err2) throw err2;
                else res(rows2[0]);
            });   
        }else{}
    });        
}
function eliminar(req, res){
    const data = req.params;
    connection.query('DELETE FROM usuarios WHERE id = "'+ data.id +'";',
        function (err, rows) {
            res.redirect('/usuarios/todos');
        }
    );
}

function todos(callback){
    connection.query('SELECT * FROM usuarios INNER JOIN privilegios ON usuarios.privilegio=privilegios.id_privilegio;', function (err, rows) {
            if(err)
			{
				throw err;
			}
			else
			{
                //devolvemos el id del usuario insertado
                //console.log(rows);
                callback(rows);
			}
        }
    );    
}
module.exports = usuariosController;