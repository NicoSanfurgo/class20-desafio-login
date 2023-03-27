const {Router} = require('express')
const routerRegistro = new Router()
const express = require('express')
routerRegistro.use(express.json())
routerRegistro.use(express.urlencoded({ extended: true }))

const usuarios = []

// REGISTRO
routerRegistro.get('/', (req, res) => {
    res.sendFile('register.html', { root: './public/login' })
})

routerRegistro.post('/', (req, res) => {
    const { nombre, password, direccion } = req.body
    const usuario = usuarios.find(usuario => usuario.nombre == nombre)
    if (usuario) {
        return res.render('register-error');
    }
    usuarios.push({ nombre, password, direccion })
    res.redirect('/login')
})
  
module.exports={routerRegistro, usuarios}