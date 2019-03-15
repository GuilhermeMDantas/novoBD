const mongoose = require('mongoose');

// SCHEMA //
const escolaridadeSchema = mongoose.Schema({
    _id:String,
    escolaridade:{
        required:true,
        unique:true,
        trim:true,
        type:String
    }
})

const Escolaridade = mongoose.model('Escolaridade', escolaridadeSchema);

module.exports = { Escolaridade };

