const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();
let { verificaTokenImg } = require('../middlewares/autentificacion');

app.get('/imagenes/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img
        //contruyamos un path
        //carpeta assets almacenamos cosas globales adicionamos imagen-nofound

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    if (fs.existsSync(pathImagen)) {
        //let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        // sendFile traemos el archivo indicado de un path
        res.sendFile(pathImagen);;
    } else {
        //creamos un path absoluto
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});


module.exports = app;