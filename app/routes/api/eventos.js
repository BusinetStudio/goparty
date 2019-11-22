var mongoose = require('mongoose');
var router = require('express').Router();
var Eventos = mongoose.model('Eventos');
var Cotizaciones = mongoose.model('Cotizaciones');
var moment = require('moment');

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
        Eventos.find({ 
            servicios_solicitados : { "$in" : req.body.servicios_solicitados}, 
            _id: {"$nin":cotizados},
            expira: {"$gt": moment().valueOf()},
        }, function (err, result) {
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
      Evento.expira = moment().add(3, 'days').valueOf();
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

router.post('/checkOldEvents', async function(req,res){
    var eventos = await Eventos.find({id_usuario: req.body.id_usuario, proveedorPuntuado: false, expira: {$gt:moment().valueOf()}}).exec();
    if(eventos && Object.keys(eventos).length > 0){
        return res.json({valid:true, eventos})
    }else{
        return res.json({valid:false})
    }
})
router.post('/getProveedoresNoPuntuados', async function(req,res){
    var eventos = await Cotizaciones.find({id_evento:req.body.id_evento, aceptada:true}).exec();
    var proveedores = []
    Promise.all([
        eventos
    ]).then(r=>{
        for(key in eventos){
            proveedores.push(eventos.id_proveedor)
        }
    })
    var proveedoresInfo = await ProveedoresInfo.find({id_proveedor: {$in:proveedores}}).exec();
    if(proveedoresInfo && Object.keys(proveedoresInfo).length > 0){
        return res.json({valid:true, proveedores: proveedoresInfo})
    }else{
        return res.json({valid:false})
    }
})
router.post('/eventoPuntuar', async function(req, res, next){
    req.body.puntuaciones.forEach(async (e,i)=>{
        var proveedorUpdate = await ProveedoresInfo.findOne({id_proveedor: i}).exec();
        Promise.all([proveedorUpdate]).then(result=>{
            var puntaje = ( (result.puntaje * result.numPuntuados) + e ) / (result.numPuntuados + 1);
            var numPuntuados = result.numPuntuados + 1;
            proveedorUpdate.puntaje = puntaje;
            proveedorUpdate.numPuntuados = numPuntuados;
            proveedorUpdate.save();
        }).catch(err=>{return res.json({valid: false})});
    })
    var eventoPuntuado = await Eventos.findOne({_id: req.body.id_evento}).exec()
    eventoPuntuado.proveedorPuntuado = true;
    eventoPuntuado.save().then(e=>{
        return res.json({valid: true})
    });
});
module.exports = router;