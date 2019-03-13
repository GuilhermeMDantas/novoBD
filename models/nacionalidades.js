const mongoose = require('mongoose');

// SCHEMA //
const nacionalidadeSchema = mongoose.Schema({
    nacionalidade:{
        required:true,
        unique:true,
        trim:true,
        type:String
    }
})

const Nacionalidade = mongoose.model('Nacionalidade', nacionalidadeSchema);

module.exports = { Nacionalidade };

