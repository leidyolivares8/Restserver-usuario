const express = require('express'); //LIBRERIA CREAR APLICACIONES WEB DEL LADO DEL SERVIDOR

const app = express();

app.use(require('./usuario')); //Enlazar pagina entrada del localhost con usuario GEP-POST-DELETE

app.use(require('./login'));


module.exports = app;