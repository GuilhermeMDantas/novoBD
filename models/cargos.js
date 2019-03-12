// DEPENDENCIES
const mongoose = require('mongoose');
// const config = require('../config/config').get(process.env.NODE_ENV);

// SCHEMA //
const cargoSchema = mongoose.Schema({
    cargo:{
        required:true,
        unique:true,
        trim:true,
        type:String,
        maxlength:120
    }
})

const Cargo = mongoose.model('Cargo', cargoSchema);

module.exports = { Cargo };

