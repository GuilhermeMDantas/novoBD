const mongoose = require('mongoose');

// SCHEMA //
const estadoSchema = mongoose.Schema({
    estado:{
        required:true,
        unique:true,
        trim:true,
        type:String
    }
})

const EstadoCivil = mongoose.model('EstadoCivil', estadoSchema);

module.exports = { EstadoCivil };

