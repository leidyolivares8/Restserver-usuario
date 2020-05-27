const express = require('express');
const app = express();
const _ = require('underscore');

let { verificaToken, verificarolAdmin } = require('../middlewares/autentificacion');
let Categorial = require('../models/categoria');


//=======================================//
//Mostrar todas las categorias//
//=======================================//
app.get('/categoria', verificaToken, (req, res) => {

    Categorial.find({})
        .sort('nombre') //ordenar
        .populate('usuario', 'nombre email')
        //ultimo populate permite traer datos de la otra tabla usuario 
        .exec((err, categoriasmm) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoriasmm) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No hay datos'
                    }
                });
            }
            return res.json({
                ok: true,
                categoriasmm
            });
        });
});

//=======================================//
//Mostrar una categoria por id //
//=======================================//
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categorial.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            })
        }

        return res.json({
            ok: true,
            categoriaBD

        })


    });
});

//=======================================//
//Crear nueva categoria //
//=======================================//
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categorial({
        nombre: body.nombre,
        usuario: req.usuario._id //viene del verificaToken
            //usuario: body.usuario
    });
    categoria.save((err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) { //si no guardo la cagtegoria
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })

    });

});


//=======================================//
//Actualizar la descripcion de la categoria //
//=======================================//
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let nomCategoria = {
        nombre: body.nombre
    }

    Categorial.findOneAndUpdate(id, nomCategoria, { new: true }, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) { //si no guardo la cagtegoria
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});



//=======================================//
//Eliminar categoria //
//=======================================//
app.delete('/categoria/:id', [verificaToken, verificarolAdmin], (req, res) => {
    let id = req.params.id;

    Categorial.findByIdAndRemove(id, (err, categoriaBD) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err

            })
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }
        res.json({
            ok: true,
            message: 'La categoria fue borrada'
        })
    })

});


module.exports = app;