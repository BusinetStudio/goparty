var mongoose = require('mongoose');
var router = require('express').Router();
var Eventos = mongoose.model('Eventos');
var Cotizaciones = mongoose.model('Cotizaciones');

router.post('/getFiestas', function(req, res, next){
    Eventos.find({ id_usuario: req.body.id_usuario }, function (err, result) {
        if (err) throw err;
        if (result) { return res.json({valid:true, result: result}) } 
        else {
            return res.json({valid:false})
        }
    });
});

router.post('/getFiestasProveedor', function(req, res, next){
    Cotizaciones.find({id_proveedor: req.body.proveedor},function(err,cotizaciones){
        var cotizados = []
        if (err) return res.json({valid:false})
        if(cotizaciones){
            cotizaciones.forEach(e=>{
                cotizados.push(e.id_evento)
            })
        }
        Eventos.find({ servicios_solicitados : { "$in" : req.body.servicios_solicitados}, id_usuario: {"$nin":cotizados} }, function (err, result) {
            if (err) throw err;
            if (result) { return res.json({valid:true, result: result}) } 
            else {
                return res.json({valid:false})
            }
        });
    })
    
});





router.post('/getFiestaById', function(req, res, next){
    Eventos.findOne({ _id: req.body.id }, function (err, result) {
        if (err) throw err;
        if (result) { return res.json({valid:true, result: result}) } 
        else {
           return res.json({valid:false})
        }
    });
});

router.post('/nuevaFiesta', function(req, res, next){
   
    var Evento = new Eventos();
    
    for(key in req.body){
        Evento[key] = req.body[key];
      }
    Evento.save().then(function(){
        return res.json({valid: true});
    }).catch(next);
}); 

router.post('/borrarFiesta', function(req, res, next){
    console.log(req.body.id);
    Eventos.deleteOne({_id: req.body.id}, function (err) {
        if(err) return res.json({valid:false});
        else return res.json({valid:true});
    });
    //return res.json({valid:false})
}); 
module.exports = router;