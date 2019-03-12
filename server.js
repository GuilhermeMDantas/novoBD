// DEPENDENCIES //
const express = require('express');                 // Servidor que vai pegar os requests
const bodyParser = require('body-parser');          // Transforma os requests em .json
const cookieParser = require('cookie-parser');      // Transforma os cookies em .json
const mongoose = require('mongoose');               // MongoDB
// const config = require('./config/config').get(process.env.NODE_ENV);
const cors = require('cors');                       // Dev Only. Para poder enviar/receber dados pelo navegador no mesmo ip
const app = express();                              // Server


// CONFIG //
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/teste_db_rh", {useNewUrlParser:true});
mongoose.set('useCreateIndex', true);


// MODULES //
const { Cargo }     = require('./models/cargos');
const { Servidor }  = require('./models/servidor');


// MIDDLEWARE //
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


// GET //

// Lista todos os campos vazios em funcionarios/servidores
app.get('/api/servidores/count/empty', (req,res)=>{
    // Todos os campos vazios
    Servidor.countDocuments({$or: [{nome: 'None'}, {cpf: '0'}, {rg: '0'}]}, (err,count)=>{
        if(err) return res.status(400).send(err);        

        // Todos os nomes
        Servidor.countDocuments({nome:'None'}, (err,nome)=>{
            if(err) return res.status(400).send(err);
            
            // Todos os CPFs
            Servidor.countDocuments({cpf:'0'}, (err,cpf)=>{
                if(err) return res.status(400).send(err);
                
                // Todos os RGs
                Servidor.countDocuments({rg:'0'}, (err,rg)=>{
                    if(err) return res.status(400).send(err);

                    res.json({
                        total:"Total number of entries without fields",
                        count: count,
                        totalNomes:"Total number of entries without names",
                        countNomes: nome,
                        totalCPFs:"Total number of entries without cpfs",
                        countCPFs: cpf,
                        totalRGs:"Total number of entries without RGs",
                        countRGs: rg
                    })
                })
            })                    
        })
    })
})

// Usa QueryStrings pra procurar servidores
app.get('/api/servidores/find', (req,res)=>{
    // Se req.query.X != null
    // Y = req.query.X
    // else
    // Y = null
    const unsp = "Unspecified";
    let nome    = req.query.nome ? req.query.nome : unsp;
    let cpf     = req.query.cpf ? req.query.cpf : unsp;
    let rg      = req.query.rg ? req.query.rg : unsp;

    // Se nenhum informado
    if (nome === unsp && cpf === unsp && rg === unsp) return res.status(400).json({erro:"Nenhum valor foi específicado"});

    // nome informado
    if(nome !== unsp) {

        // Procura por todos os matchs do nome
        Servidor.find({nome: {$regex: nome}}, (err,doc)=>{
            if(err) return res.status(400).send(err);

            // Não encontrou
            if(doc === null) return res.status(200).json({erro:"Nenhum documento encontrado"})

            return res.status(400).send(doc);
        })

    } // CPF informado 
    else if(cpf !== unsp) {
        
        // Procura por apenas um CPF por ele ser unique
        Servidor.find({cpf: cpf}, (err,doc)=>{
            if(err) return res.status(400).send(err);

            // Não encontrou
            if(doc === null) return res.status(200).json({erro:"Nenhum documento encontrado"})
            
            return res.status(400).send(doc);
        })
    } // RG informado
    else if(rg !== unsp) {

        // Procura por todos os match do RG
        Servidor.find({rg: {$regex: rg}}, (err,doc)=>{
            if(err) return res.status(400).send(err);
            
            // Não encontrou
            if(doc === null) return res.status(200).json({erro:"Nenhum documento encontrado"})

            return res.status(400).send(doc)
        })
    }


})

app.get('/api/cargos', (req,res)=>{
    Cargo.find((err,doc)=>{
        if(err) return res.status(400).send(err);
        
        res.status(200).json(doc);
    })
})

app.get('/api/unidades', (req,res)=>{
    res.status(200).json('api of \'unidades\' goes here');
})

app.get('/api/cidades', (req,res)=>{
    res.status(200).json('api of \'cidades\' goes here');
})

app.get('/api/estadocivil', (req,res)=>{
    res.status(200).json('api of \'estados civis\' goes here');
})

app.get('/api/formacoes', (req,res)=>{
    res.status(200).json('api of \'formações\' goes here');
})

app.get('/api/nacionalidades', (req,res)=>{
    res.status(200).json('api of \'nacionalidades\' goes here');
})

app.get('/api/segmentos', (req,res)=>{
    res.status(200).json('api of \'segmentos\' goes here');
})

app.get('/api/situacoes', (req,res)=>{
    res.status(200).json('api of \'situações\' goes here');
})

app.get('/api/escolaridades', (req,res)=>{
    res.status(200).json('api of \'escolaridades\' goes here')
})


// POST //
app.post('/api/populate/funcionarios', (req,res)=>{
    let funcionario = new Servidor(req.body);

    funcionario.save((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({
            success:true,
            added:funcionario.nome
        })
    })
})

app.post('/api/populate/cargos', (req,res)=>{
    let cargo = new Cargo(req.body)

    cargo.save((err,doc)=>{
        if(err) return res.status(400).json(err);
        res.status(200).json({
            success:true,
            added:cargo.cargo
        })
    })
})

app.post('/api/populate/unidades', (req,res)=>{
    
})

app.post('/api/populate/cidades', (req,res)=>{
    
})

app.post('/api/populate/estadocivil', (req,res)=>{
    res
})

app.post('/api/populate/formacoes', (req,res)=>{
    
})

app.post('/api/populate/nacionalidades', (req,res)=>{
    
})

app.post('/api/populate/segmentos', (req,res)=>{
    
})

app.post('/api/populate/situacoes', (req,res)=>{
    
})

app.post('/api/populate/escolaridades', (req,res)=>{
    
})

// UPDATE //


// DELETE //

// START //
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Server Running');
})