const mongoose = require('mongoose');

// SCHEMA //
const formacoesSchema = mongoose.Schema({
    formacao:{
        required:true,
        unique:true,
        trim:true,
        type:String
    }
})

const Formacao = mongoose.model('Formacao', formacoesSchema);

module.exports = { Formacao };

