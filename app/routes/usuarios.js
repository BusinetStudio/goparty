module.exports = function(
    router, 
    isLoggedIn,
    usuariosController, 
  ){
  router.get('/usuarios/todos', isLoggedIn, function(req, res, next) {
    usuariosController.todos(function(result){
      res.render(
        'usuarios/todos', 
        { 
          title: 'Usuarios',
          usuarios: result,
          params: req.query
        }
      );
    });
  });
  router.get('/usuarios/nuevo/', isLoggedIn, function(req, res, next){
      res.render(
        'usuarios/nuevo', 
        { 
          title: 'Usuarios',
        }
      );
  });
  router.get('/usuarios/editar/:id', isLoggedIn, function(req, res, next){
    var idU = req.params.id;
    usuariosController.getById(idU, function(usuario){
      res.render(
          'usuarios/editar', 
          { 
              title: 'Usuarios',
              usuario: usuario,
              params: req.query
          }
      );
    });
  });

  router.post('/usuarios/nuevo', usuariosController.nuevo);
  router.get('/usuarios/borrar/:id', usuariosController.eliminar);
}