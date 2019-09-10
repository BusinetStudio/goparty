var mongoose = require('mongoose');
var router = require('express').Router();
var Eventos = mongoose.model('Eventos');

router.post('/getFiestas', function(req, res, next){
    Eventos.find({ id_usuario: req.body.id_usuario }, function (err, result) {
        if (err) throw err;
        if (result) { res.json({valid:true, result: result}) } 
        else {
            res.json({valid:false})
        }
    });
});

router.post('/getFiestaById', function(req, res, next){
    Eventos.find({ _id: req.body.id }, function (err, result) {
        if (err) throw err;
        if (result) { res.json({valid:true, result: result}) } 
        else {
            res.json({valid:false})
        }
    });
});

router.post('/nuevaFiesta', function(req, res, next){
    var Evento = new Eventos();
    req.body.forEach((e,i)=>{
        Evento[i] = e 
    })
    Evento.save().then(function(){
        return res.json({valid: true});
    }).catch(next);
    return res.json({valid:false})
}); 

router.post('/borrarFiesta', function(req, res, next){
    Evento.deleteOne({_id: req.body.id}, function (err) {
        if(err) return res.json({valid:false});
        else return res.json({valid:true});
    });
    return res.json({valid:false})
}); 