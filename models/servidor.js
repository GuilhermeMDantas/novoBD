const mongoose = require('mongoose');

const servidorSchema = mongoose.Schema({
    nome:{
        type: String,
        trim: true
    },
    registro:{
        type:String,
        trim:true
    },
    cpf:{
        type: String,
        trim:true
    },
    rg:{
        type: String,
        trim:true
    },
    enderecos:[{
        rua:{type:String, trim:true},
        bairro:{type:String, trim:true},
        cep:{type:String, trim:true},
        obs:{type:String, trim:true}
    }],
    genero:String,
    contato:[String],                                                               // Array
    nascimento:{type:String, trim:true},
    naturalidade:{type:String, trim:true},
    formacao:{type:String, trim:true},
    estadocivil:{type:String, trim:true},          // Referencia
    escolaridade:{type:String, trim:true}         // Referencia 
})


// Nome 'Servidore' para que o mongo salve a collection com nome 'Servidores' e não 'Servidors'
const Servidor = mongoose.model('Servidore', servidorSchema);

module.exports = { Servidor };