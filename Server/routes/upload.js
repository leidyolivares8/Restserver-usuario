const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//Importacion del esquema para tener acceso a toda la informacion o metodos de un usuario
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// fs utilizar para evaluar si en el filesystem existe la imagen , fs paquete ya tiene node
const fs = require('fs');
//Construir un path para poder llegar al archivo desde las rutas, path paquete tiene node
const path = require('path');

//default options midelware express-fileupload
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha selecionado un archivo'
                }
            });
    }

    //Validar tipo y creamos arrego
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son  ' + tiposValidos.join(',') //join: para unir por coma y espacio datos del array

            }
        })
    }

    let archivo = req.files.archivo; //variable archivo en el body form-data archivo agarro lo que estoy posteando 
    let nombreCortado = archivo.name.split('.'); //split: para segmentar el nombre del archivo por punto clg: ['champu','jpg']
    let extension = nombreCortado[nombreCortado.length - 1] //length -1 para obtener la ultima posicion: jpg

    //Extensiones permitidas , y creamos un arreglo:
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) { //indexOf: para buscar en el arreglo

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(','), //join: para unir por coma y espacio datos del array
                ext: extension
            }
        })

    }

    //cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //subir el archivo
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            }); // aqui ya imagen cargada en carpeta

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        } // si so varios con un switch

    });

});

//id del url lo consulto en el modelo squema usuario
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios'); //aunque suceda un error la imagen se subio
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios'); // si el usuario no existe, tengo que borrar la imagen que se subio si enviaron un id que no era no se llena de imagenes el servidor
            return res.status(400).json({
                ok: false,
                err: { message: 'El usuario no existe' }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    });
}

//Borrar del servidor las imagenesy dejar solo una por usuario,en la base de datos tengo solo una en el campo de cada usuario
function borraArchivo(nombreImagen, tipo) {

    //1.verificar que la ruta path, exista filesystem, construir un path
    //2.confirmar si el path existe(existsSync), si existe se borra
    //3.unlinkSync borrar 
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


//id del url lo consulto en el modelo squema producto
function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: { message: 'El producto no existe' }
            })
        }
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })


    });


}


//renombrar en el servidor las imagenes para que no se sobreescriba si ingresan un nombre igual
// en la proxima clase vamos a asignar laimagen a un registro ya sea de usuario o producto
//ademnas regresar la imagen para que la puedan usar y 
module.exports = app;