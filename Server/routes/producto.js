const express = require('express');
const app = express();

let { verificaToken, verificarolAdmin } = require('../middlewares/autentificacion');
let Productol = require('../models/producto');

//==============================
//Obtener productos
//==============================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    Productol.find({ disponible: true })
        .skip(desde) //paginado
        .limit(5)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!productosDB) {
                return res.status(500).json({
                    ok: false,
                    message: 'Productos no encontrados'
                })
            }
            return res.json({
                ok: true,
                productosDB
            })

        });

});

//==============================
//Obtener un producto
//==============================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Productol.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'El id del producto no fue encontrado'
                })
            }

            res.json({
                ok: true,
                producto: productosDB
            })
        });

});


//==============================
//Buscar productos
//==============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //'i' sensitive mayus,minus
    //RegExp expresion regular basada en el termino para buscar en BD lo que contenga el termino

    Productol.find({ nombre: regex }) //buscando el valor exacto como esta en la base de datos (termino) ó (RegExp) lo que contenga
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'El id del producto no fue encontrado'
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        });

});



//==============================
//Crear productos
//==============================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Productol({
        nombre: body.nombre,
        precioUni: body.preciouni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria, //como traer la categoria de la otra tabla?
        usuario: req.usuario._id //viene del verificaToken
    });

    producto.save((err, productosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productosDB
        });
    });

});

//==============================
//Actualiza producto
//==============================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Productol.findById(id, (err, productosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productosDB) {
            return res.status(500).json({
                ok: false,
                message: 'El id del producto no fue encontrado'
            })
        }

        productosDB.nombre = body.nombre;
        productosDB.preciouni = body.precioUni;
        productosDB.descripcion = body.descripcion;
        productosDB.disponible = body.disponible;
        productosDB.categoria = body.categoria;

        productosDB.save((err, productoactualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoactualizado
            });

        })
    });
});

//==============================
//Delete actualizar un producto
//==============================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Productol.findById(id, (err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                message: 'El id del producto no fue encontrado'
            })
        }

        productosDB.disponible = false;
        productosDB.save((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productosDB,
                mensaje: 'Estado actualizado false'
            });
        });

    });
});
//==============================
//Obtener productos por categoria
//==============================
app.get('/producto/categoria/:cate', verificaToken, (req, res) => {

    let cate = req.params.cate;

    let desde = req.query.desde || 0;
    desde = Number(desde)

    Productol.find({ categoria: cate })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!productosDB) {
                return res.status(500).json({
                    ok: false,
                    categoria,
                    message: 'Productos no encontrados'
                })
            }
            return res.json({
                ok: true,
                productosDB
            })

        });

});


module.exports = app;