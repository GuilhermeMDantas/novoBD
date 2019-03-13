const mongoose = require('mongoose');

const cidadeSchema = mongoose.Schema({
    cidade:{
        required:true,
        type: String,
        trim: true
    },
    uf:{
        required:true,
        type: String
    }
})


const Cidade = mongoose.model('Cidade', cidadeSchema);

module.exports = { Cidade };