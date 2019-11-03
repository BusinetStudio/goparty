var mongoose = require('mongoose');
var router = require('express').Router();
var Cotizaciones = mongoose.model('Cotizaciones');
var ProveedoresInfo = mongoose.model('ProveedoresInfo');


router.post('/getCotizaciones', function(req, res, next){
    Cotizaciones.find({ id_proveedor: req.body.id_proveedor, aceptada: true }, function (err, result) {
        if (err) throw err;
        if (result) { return res.json({valid:true, result: result}) } 
        else {
            return res.json({valid:false})
        }
    });
});

router.post('/getCotizacionByEvento', function(req, res, next){
    Cotizaciones.find({ id_usuario: req.body.id_usuario, id_evento: req.body.id_evento }).then( async cotizaciones=>{ 
        var resultado = []
        for (var key in cotizaciones){
            var proveedor_info = await ProveedoresInfo.findOne({id_proveedor: cotizaciones[key].id_proveedor}).exec();
            resultado.push({
                cotizacion: cotizaciones[key],
                proveedor_info: proveedor_info
            }) 
        }
        return res.json({valid:true, result:resultado})
        
    }).catch(function(error) {
        return res.json({valid:false})
    });
});



router.post('/getCotizacionById', function(req, res, next){
    Cotizaciones.findById(req.body.id, function (err, result) {
        if (err) throw err;
        if (result) { return res.json({valid:true, result: result}) } 
        else {
            return res.json({valid:false})
        }
    });
});

router.post('/aceptarCotizacion', function(req, res, next){
    var query = { '_id':req.body.id };
    var datos = {aceptado: true};
    delete datos.id;
    Cotizaciones.findOneAndUpdate( query,datos,{new: true, useFindAndModify: false},
        (err2, todo) => {
          if (err2) return res.json({valid:false});
          else return res.json({valid: true})
        }
    )
});

router.post('/nuevaCotizacion', function(req, res, next){
    var Cotizacion = new Cotizaciones();
    for(key in req.body){
        Cotizacion[key] = req.body[key];
      }
    Cotizacion.save().then(function(){
        return res.json({valid: true});
    }).catch(next);
}); 

router.post('/borrarCotizacion', function(req, res, next){
    Cotizacion.deleteOne({_id: req.body.id}, function (err) {
        if(err) return res.json({valid:false});
        else return res.json({valid:true});
    });
    return res.json({valid:false})
}); 

module.exports = router;