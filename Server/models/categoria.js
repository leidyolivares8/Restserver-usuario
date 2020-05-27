const mongoose = require('mongoose'); //importar mongoose
let Schema = mongoose.Schema; //Obtener el cascaron para crear squemas de mongoose ,

let categoriaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }
    //type: Schema.Types.ObjectId permite establecer la relación entre un campo de una tabla y otra.
});
module.exports = mongoose.model('categoria', categoriaSchema, "categorias")