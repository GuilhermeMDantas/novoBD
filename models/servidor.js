const mongoose = require('mongoose');

const servidorSchema = mongoose.Schema({
    nome:{
        required:true,
        type: String,
        trim: true
    },
    cpf:{
        required:true,
        type: String
    },
    rg:{
        required:true,
        type: String
    }
})


// Nome 'Servidore' para que o mongo salve a collection com nome 'Servidores' e não 'Servidors'
const Servidor = mongoose.model('Servidore', servidorSchema);

module.exports = { Servidor };