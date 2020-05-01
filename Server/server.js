require('./Config/config');
const express = require('express'); //LIBRERIA CREAR APLICACIONES WEB DEL LADO DEL SERVIDOR
const mongoose = require('mongoose'); //LIBRERIA PARA CONECTARNOS A LA BASE DE DATOS MONGO
const path = require('path');

const app = express();
const bodyParser = require('body-parser')

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //midelware cada peticion pasa siempre por aqui
    //parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));

//CONFIGURACION GLOBAL DE RUTAS
app.use(require('./routes/index'));

//CONFIGURACION RUTAS
//app.use(require('./routes/usuario')); //Enlazar pagina entrada del localhost con usuario GEP-POST-DELETE
//app.use(require('./routes/login')); //index.js



//CONEXION A LA BASE DE DATOS EN LA NUBE CONECTAR MLAB O MONGO ATLAS REMOTA Y LOCAL
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');

});

//CONEXION A LA BASE DE DATOS LOCAL
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true }, //{esto por mensaje en el git bash}
//    (err, res) => {
//       if (err) throw err;
//       console.log('Base de datos ONLINE');
// });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000:', process.env.PORT);
})