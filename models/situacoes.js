const mongoose = require('mongoose');

// SCHEMA //
const situacaoSchema = mongoose.Schema({
    situacao:{
        required:true,
        unique:true,
        trim:true,
        type:String,
        maxlength:120
    }
})

const Situacao = mongoose.model('Situacao', situacaoSchema);

module.exports = { Situacao };

