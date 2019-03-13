const mongoose = require('mongoose');

const unidadeSchema = mongoose.Schema({
    hierarquia:{
        type:String,
        required:true,
        unique:true
    },
    secao:{
        type:String,
        default:'Unspecified',
        trim:true,
    },
    divisao:{
        default:'Unspecified',
        type:String,
        trim:true
    },
    sigladiv:{
        default:'Unspecified',
        type:String,
        required: function() { return this.divisao != 'Unspecified'}    // True se tiver um valor   --  False se for 'Unspecified'
    },
    departamento:{
        type:String,
        default:'Unspecified',
        trim:true
    },
    sigladep:{
        type:String,
        default:'Unspecified',
        trim:true,
        required: function() { return this.departamento != 'Unspecified'}  // True se tiver um valor   --  False se for 'Unspecified'
    },
    endereco:{
        type:String,
        default:'Unspecified',
        trim:true
    },
    telefone:{
        type:[String],
        default:-1
    },
    ramal:{
        type:Number,
        default:-1
    }
})


unidadeSchema.pre('save', function(next) {
    if (this.secao === null)        this.secao          = 'Unspecified';
    if (this.divisao === null)      this.divisao        = 'Unspecified';
    if (this.departamento === null) this.departamento   = 'Unspecified';
    if (this.endereco === null)     this.endereco       = 'Unspecified';
    if (this.telefone === null)     this.telefone       = ['Unspecified'];
    if (this.ramal === null)        this.ramal          = -1;

    next();
})



const Unidade = mongoose.model('Unidade', unidadeSchema);

module.exports = { Unidade };