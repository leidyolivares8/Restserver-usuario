const express = require('express'); //LIBRERIA CREAR APLICACIONES WEB DEL LADO DEL SERVIDOR

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken'); //LIBRERIA PARA TOKEN
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de google
async function verify(token) { //async retorna una promesa pero es necesaria para un await
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // Si funciona la validacion del token enviamos un objeto personalizado
    return { //return 
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => { //+cuando se hace un posteo recibimos el token
    //obtener el token que viene del request
    let token = req.body.idtoken;
    let googleUser = await verify(token) //+ con el token llamamos la  funcion verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    //+ si lo hace correctamente la verificacion voy a tener un objeto googleUser con cierta informacion de google 
    //+ llamar el squema findOne para buscar si en mi base de datos tengo un usuario con ese correo         
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB) { //si existe el usuario pero no se autenticado por google, no debe ser permitido
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autentificacion normal'
                    }
                })
            } else { // +si si se autentico con google renuevo su token y lo regreso
                let token = jwt.sign({ //pagina del npm jsonwebtoken para crear token  firmado cifrado cuya llave es el SEED
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else { //+ primera vez que ese usuario se este autentificando
            //Si el usuario no existe en nuestra basse de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.goog = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => { //+grabar usuairo en la base de datos
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({ //pagina del npm jsonwebtoken para crear token  firmado cifrado cuya llave es el SEED
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });


            });
        }

    });

});
module.exports = app;