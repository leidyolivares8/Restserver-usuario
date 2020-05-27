//===================================
//Puerto 
//=================================
//creo variable process.env.PORT para el puerto que sea global
process.env.PORT = process.env.PORT || 3000;

//===================================
//ENTORNO 
//=================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================
//Vencimiento del Token
//=================================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h'; //expira en 48 horas

//===================================
//SEED de autentificacion
//=================================
//creo variable en HEROKU que sea el seed de mi aplicacion y no lo vean en el gitgub ni heroku SEED Este_es_el_seed_producion
process.env.SEED = process.env.SEED || 'Este_es_el_seed_desarrollo';


//===================================
//Base de datos 
//=================================
let urlDB;

if (process.env.NODE_ENV === 'dev') { //'dev' ambiente de desarrollo en postman
    urlDB = 'mongodb://localhost:27017/cafe'; //BD LOCAL
} else {
    urlDB = process.env.MONGO_URI;
    //Variable de entorno, CREAMOS variable MONGO_URI, que para poderla ver se necesiten las credenciales de heroku, $heroku config
    //urlDB = 'mongodb+srv://Leidy_8:Cdjb5meCPpzCo3zu@cluster0-rexou.mongodb.net/cafe?retryWrites=true&w=majority';
    //contiene urlDB la url de la BD EN LA NUBE de Mongo Atlas
}
process.env.URLDB = urlDB;

//===================================
//Google Client ID
//=================================
//Validar token de google, yo puedo definir process.env.CLIENT_ID en heroku
process.env.CLIENT_ID = process.env.CLIENT_ID || '865280602395-k1u0t4d47d0fke7gasiak2jdc9qk0r4o.apps.googleusercontent.com';