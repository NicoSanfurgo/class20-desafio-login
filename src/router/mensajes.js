const {Router} = require('express')
const routerMensajes = new Router()

const ContenedorMsjs = require('./ContenedorArchivo')
const mensajesApi = new ContenedorMsjs("./DB/mensajes.txt")

// Normalizacion
const { normalize,schema } = require('normalizr');
const authorNormalizerSchema = new schema.Entity('author',{},{
    idAttribute: 'mail'
})
const textNormalizerSchema = new schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema];


routerMensajes.get('/', async (req, res) => {
    let msjs= await mensajesApi.getAll()
    console.log(msjs)
    res.json(normalize(msjs, messagesNormalizerSchema, {idAttribute: 'email'}))
  })
routerMensajes.post('/', async (req, res) => {
    res.json(` ${await mensajesApi.save(req.body)}!`)
  })

module.exports={routerMensajes}