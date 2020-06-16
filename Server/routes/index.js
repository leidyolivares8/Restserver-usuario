const express = require('express'); //LIBRERIA CREAR APLICACIONES WEB DEL LADO DEL SERVIDOR

const app = express();

app.use(require('./usuario')); //Enlazar pagina entrada del localhost con usuario GEP-POST-DELETE

app.use(require('./categoria'));

app.use(require('./producto'));

app.use(require('./login'));

app.use(require('./upload'));


app.use(require('./imagenes'));

module.exports = app;