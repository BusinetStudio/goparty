var mongoose = require('mongoose');
var router = require('express').Router();
var Cotizaciones = mongoose.model('Cotizaciones');



router.post('/getCotizaciones', function(req, res, next){
    Eventos.find({ id_proveedor: req.body.id_proveedor, aceptada: true }, function (err, result) {
        if (err) throw err;
        if (result) { res.json({valid:true, result: result}) } 
        else {
            res.json({valid:false})
        }
    });
});

router.post('/getCotizacionByEvento', function(req, res, next){
    Eventos.find({ id_usuario: req.body.id_usuario, id_evento: req.body.id_evento }, function (err, result) {
        if (err) throw err;
        if (result) { res.json({valid:true, result: result}) } 
        else {
            res.json({valid:false})
        }
    });
});



router.post('/getCotizacionById', function(req, res, next){
    Eventos.find({ _id: req.body.id }, function (err, result) {
        if (err) throw err;
        if (result) { res.json({valid:true, result: result}) } 
        else {
            res.json({valid:false})
        }
    });
});

router.post('/aceptarCotizacion', function(req, res, next){
    var query = { '_id':req.body.id };
    var datos = {aceptado: true};
    delete datos.id;
    User.findOneAndUpdate( query,datos,{new: true, useFindAndModify: false},
        (err2, todo) => {
          if (err2) return res.json({valid:false});
          else return res.json({valid: true})
        }
    )
});

router.post('/nuevaCotizacion', function(req, res, next){
    var Cotizacion = new Cotizaciones();
    req.body.forEach((e,i)=>{
        Cotizacion[i] = e 
    })
    Cotizacion.save().then(function(){
        return res.json({valid: true});
    }).catch(next);
    return res.json({valid:false})
}); 

router.post('/borrarCotizacion', function(req, res, next){
    Cotizacion.deleteOne({_id: req.body.id}, function (err) {
        if(err) return res.json({valid:false});
        else return res.json({valid:true});
    });
    return res.json({valid:false})
}); 

module.exports = router;