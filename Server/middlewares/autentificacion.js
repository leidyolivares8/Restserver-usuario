const jwt = require('jsonwebtoken');

//funcion que ejecute algo en particular
//========================
//Verificar Token
//===============================
let verificaToken = (req, res, next) => {


    //1.leer el headerar(token)
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => { //Validar el token con jWt

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        //cualquier peticion pueda tener acceso despues de la validacion
        req.usuario = decoded.usuario;
        next();
        //next para que se ejecute todo lo que siga despues del middleware
    });

    console.log(token);

};

//funcion o middleware que ejecute algo en particular
//==============================
//Verificar rolAdmin
//===============================
let verificarolAdmin = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no es administrador' }
        });
    }
};
module.exports = {
    verificaToken,
    verificarolAdmin
}