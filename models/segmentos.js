const mongoose = require('mongoose');

// SCHEMA //
const segmentoSchema = mongoose.Schema({
    segmento:{
        required:true,
        unique:true,
        trim:true,
        type:String
    }
})

const Segmento = mongoose.model('Segmento', segmentoSchema);

module.exports = { Segmento };

