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
const { Cargo }         = require('./models/cargos');
const { Servidor }      = require('./models/servidor');
const { Unidade }       = require('./models/unidades');
const { Cidade }        = require('./models/cidades');
const { EstadoCivil }   = require('./models/estadoCivil');
const { Formacao }      = require('./models/formacoes');
const { Nacionalidade } = require('./models/nacionalidades');
const { Segmento }      = require('./models/segmentos');
const { Situacao }      = require('./models/situacoes');
const { Escolaridade }  = require('./models/escolaridades');


// MIDDLEWARE //
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


// GET //
// Encapsulamento pra poder minimizar as apis
{
    // Lista todos os campos vazios na colletion
    app.get('/api/servidores/count/empty', (req,res)=>{
        // Nomes vazios
        Servidor.countDocuments({nome: null}, (err,nomes)=>{
            if(err) return res.status(400).send(err);
            
            // RFs vazios
            Servidor.countDocuments({registro:null}, (err,registros)=>{
                if(err) return res.status(400).send(err);
                
                // CPFs vazios
                Servidor.countDocuments({cpf:null}, (err,cpfs)=>{
                    if(err) return res.status(400).send(err);
                    
                    // RGs vazios
                    Servidor.countDocuments({rg:null}, (err,rgs)=>{
                        if(err) return res.status(400).send(err);
                        
                        // Endereços vazios
                        Servidor.countDocuments({enderecos:null}, (err,enderecos)=>{
                            if(err) return res.status(400).send(err);
                            
                            // Sexos vazios
                            Servidor.countDocuments({genero:null}, (err,generos)=>{
                                if(err) return res.status(400).send(err);
                                
                                // Data de Nascimento vazias
                                Servidor.countDocuments({nascimento:null}, (err,nascimentos)=>{
                                    if(err) return res.status(400).send(err);
                                    
                                    // Naturalidade vazia
                                    Servidor.countDocuments({naturalidade:null}, (err,naturalidades)=>{
                                        if(err) return res.status(400).send(err);
                                        
                                        // Formações vazias
                                        Servidor.countDocuments({formacao:null}, (err,formacoes)=>{
                                            if(err) return res.status(400).send(err);
                                            
                                            // Estado Civis vazios
                                            Servidor.countDocuments({estadocivil:null}, (err,estadocivis)=>{
                                                if(err) return res.status(400).send(err);
                                                
                                                // Escolaridades vazias
                                                Servidor.countDocuments({escolaridade:null}, (err,escolaridades)=>{
                                                    if(err) return res.status(400).send(err);
                                                    
                                                    res.json({
                                                        mensagem:'Número de campos vazios em TBL_DADOSPESSOAIS',
                                                        nomes:nomes,
                                                        registros:registros,
                                                        cpfs:cpfs,
                                                        rgs:rgs,
                                                        enderecos:enderecos,
                                                        generos:generos,
                                                        dataDeNascimentos:nascimentos,
                                                        naturalidades:naturalidades,
                                                        formacoes:formacoes,
                                                        estadocivis:estadocivis,
                                                        escolaridades:escolaridades
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })  
            })
        })
    })

    // Usa QueryStrings pra procurar servidores
    app.get('/api/servidores/find', (req,res)=>{
        // if (req.query.X != null) -- in other words if (req.query.X == true) => exists
        // Y = req.query.X
        // else
        // Y = unsp
        const unsp  = "Unspecified";
        let nome    = req.query.nome ? req.query.nome : unsp;
        let cpf     = req.query.cpf ? req.query.cpf : unsp;
        let rg      = req.query.rg ? req.query.rg : unsp;
        let regex   = new RegExp('^' + nome, "i");   // Adiciona automaticamente / no começo e fim || Ignore case

        // Se nenhum informado
        if (nome === unsp && cpf === unsp && rg === unsp) return res.status(400).json({erro:"Nenhum valor foi específicado"});

        // Nome informado
        if(nome !== unsp) {

            // Procura por todos os nomes que começam com ${nome}
            Servidor.find({nome: {$regex: regex}}, (err,doc)=>{
                if(err) return res.status(400).json(err);

                // Não encontrou nada
                if(doc == false) return res.json({erro:"Nenhum documento encontrado"})

                return res.status(200).send(doc);
            })

        } // CPF informado 
        else if(cpf !== unsp) {
            
            // Procura por apenas um CPF por ele ser unique
            Servidor.findOne({cpf: cpf}, (err,doc)=>{
                if(err) return res.status(400).send(err);

                // Não encontrou
                if(doc == false) return res.json({erro:"Nenhum documento encontrado"})
                
                return res.status(200).send(doc);
            })
        } // RG informado
        else if(rg !== unsp) {

            // Procura por todos os match do RG
            Servidor.find({rg: {$regex: rg}}, (err,doc)=>{
                if(err) return res.status(400).send(err);
                
                // Não encontrou
                if(doc == false) return res.json({erro:"Nenhum documento encontrado"})

                return res.status(200).send(doc)
            })
        }


    })

    app.get('/api/servidores/relatorios/formados', (req,res)=>{
        Servidor.find({formacao: {$ne: null}}, {_id:0, rf:1, nome:1, formacao:1}, (err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    // Simplesmente lista os cargos na db
    app.get('/api/cargos/list', (req,res)=>{
        Cargo.find().sort({cargo:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            
            res.status(200).json(doc);
        })
    })

    app.get('/api/unidades/list', (req,res)=>{
        Unidade.find({}).sort({hierarquia:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/cidades/list', (req,res)=>{
        Cidade.find({}).sort({cidade:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/estadocivil/list', (req,res)=>{
        EstadoCivil.find({}).sort({estado:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/formacoes/list', (req,res)=>{
        Formacao.find({}).sort({formacao:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/nacionalidades/list', (req,res)=>{
        Nacionalidade.find({}).sort({nacionalidade:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/segmentos/list', (req,res)=>{
        Segmento.find({}).sort({segmento:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/situacoes/list', (req,res)=>{
        Situacao.find({}).sort({situacao:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })

    app.get('/api/escolaridades/list', (req,res)=>{
        Escolaridade.find({}).sort({escolaridade:'asc'}).exec((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.json(doc);
        })
    })
}

// POST //
// Encapsulamento pra poder minimizar as apis
{
    app.post('/api/populate/servidor', async (req,res)=>{
        let funcionario = new Servidor(req.body);

        // Procura pela string do Estado e troca o ID pelo Nome
        if(funcionario.estado != null) {
            let estado = await EstadoCivil.findById(funcionario.estadocivil, {_id:0, estado:1});
            funcionario.estadocivil = estado.estado;


        // Procura pela string da Formação e troca o ID pelo Nome
        if(funcionario.escolaridade != null) {
            let escolaridade = await Escolaridade.findById(funcionario.escolaridade, {_id:0, escolaridade:1});
            funcionario.escolaridade = escolaridade.escolaridade;
        }
        // Procura pela string da Escolaridade e troca o ID pelo Nome
        if(funcionario.formacao != null) {
            let formacao = await Formacao.findById(funcionario.formacao, {_id:0, formacao:1});
            funcionario.formacao = formacao.formacao;
        }

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
        let unidade = new Unidade(req.body)

        unidade.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:unidade.departamento
            })
        })
    })

    app.post('/api/populate/cidades', (req,res)=>{
        let cidade = new Cidade(req.body);

        cidade.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:cidade.cidade
            })
        })
    })

    app.post('/api/populate/estadocivil', (req,res)=>{
        let estciv = new EstadoCivil(req.body);

        estciv.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:estciv.estado
            })
        })
    })

    app.post('/api/populate/formacoes', (req,res)=>{
        let formacao = new Formacao(req.body);

        formacao.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:formacao.formacao
            })
        })
    })

    app.post('/api/populate/nacionalidades', (req,res)=>{
        let nacionalidade = new Nacionalidade(req.body);

        nacionalidade.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:nacionalidade.nacionalidade
            })
        })
    })

    app.post('/api/populate/segmentos', (req,res)=>{
        let segmento = new Segmento(req.body);

        segmento.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:segmento.segmento
            })
        })
    })

    app.post('/api/populate/situacoes', (req,res)=>{
        let situacao = new Situacao(req.body);

        situacao.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:situacao.situacao
            })
        })
    })

    app.post('/api/populate/escolaridades', (req,res)=>{
        let escolaridade = new Escolaridade(req.body);

        escolaridade.save((err,doc)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                success:true,
                added:escolaridade.escolaridade
            })
        })
    })
}

// UPDATE //
// Encapsulamento pra poder minimizar as apis
{
    // Basicamente igual ao código de delete, porém atualiza invés de deletar
    app.patch('/api/update/servidor', (req,res)=>{
        // Oq vai ser atualizado e com oq
        let updateQuery = req.body.updateQuery;

        // Parametros que podem ser nome, cpf ou rg do servidor (apenas 1)
        let servidor = req.body.servidor;
        
        // Procura o servidor com os parametros
        Servidor.findOneAndUpdate({$or:[{nome: {$regex: servidor}},{cpf: servidor},{rg: servidor}]}, updateQuery, {new:true}, (err,doc)=>{
            if(err) return res.status(400).send(err);

            if(doc == null) return res.json({error:`Nenhum servidor com o parametro '${servidor}' foi encontrado`});

            res.status(200).json({deleted:true, doc});
        })
    })

}

// DELETE //
// Encapsulamento pra poder minimizar as apis
{
    // Basicamente igual ao código de update, porém deleta invés de atualizar
    app.delete('/api/delete/servidor', (req,res)=>{
        // Parametros que podem ser nome, cpf ou rg do servidor (apenas 1)
        let servidor = req.body.servidor;

        // Procura o servidor com os parametros
        Servidor.findOneAndDelete({$or:[{nome: {$regex: servidor}},{cpf: servidor},{rg: servidor}]}, {projection:{nome:1, _id:0}}, (err,doc)=>{
            if(err) return res.status(400).send(err);

            if(doc == null) return res.json({error:`Nenhum servidor com o parametro '${servidor}' foi encontrado`});

            res.status(200).json(doc);
        })
    })
}

// START //
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Server Running');
})