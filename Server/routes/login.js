const express = require('express'); //LIBRERIA CREAR APLICACIONES WEB DEL LADO DEL SERVIDOR

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken'); //LIBRERIA PARA TOKEN

const Usuario = require('../models/usuario'); // Modelo de Ususario

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'fallo incorrectos' }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: 'fallo incorrectos' }
            });
        }

        let token = jwt.sign({ //pagina del npm jsonwebtoken para crear token  firmado cifrado cuya llave es el SEED
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
            //'secret',{expira en 30 dias el token}
            //SEED es el secreto la llave para poder desifrar el token

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
            // token: '123'
        });

    });

});

module.exports = app;