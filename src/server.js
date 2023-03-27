const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const {routerMensajes} = require("./router/mensajes")
const {routerProductos} = require("./router/productos")
const {routerProductostest} = require("./router/productos-test")
const {routerLogin} = require("./router/login")
const {routerRegistro} = require("./router/registro")

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use('/api/mensajes',routerMensajes)
app.use('/api/productos',routerProductos)
app.use('/api/productos-test',routerProductostest)
app.use('/login',sessionHandler,routerLogin)
app.use('/register',sessionHandler,routerRegistro)


const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }


let sessionMiddleware = session({
  //Persistencias MongoDB Atlas
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://admin:<PASSWORD>@cluster0.e47it.mongodb.net/ecommerce?retryWrites=true&w=majority',
    mongoOptions: advancedOptions
}),
  secret: 'keysecret',
  resave: false,
  saveUninitialized: false,  
  cookie: {
    maxAge: 60000,
    expires: 600000
  }
});

app.use(sessionMiddleware)
function sessionHandler(req, res, next) { sessionMiddleware(req, res, next); }

io.on('connection', clientSocket => {
  console.log(`#${clientSocket.id} se conectó`)

  clientSocket.on('nuevoProducto', () => {
    console.log("Llego el evento del tipo Prod update")
    io.sockets.emit('updateProd')
  })
  
  clientSocket.on('nuevoMensaje', () => {
    console.log("Llego el evento del tipo Msj update")
    io.sockets.emit('updateMsj')
  })

})

app.get("/", (req,res)=> {
  res.sendFile('index.html')
})

// Ruta HOME
app.get('/', sessionHandler,(req, res) => {
  if (req.session.nombre) {
    res.sendFile('index.html', { root: './public/home' })
  } else {
    res.redirect('/login')
  }
})

// LOGOUT
app.get('/logout-despedida', (req, res) => {
  res.sendFile('logout.html', { root: './public/login' })
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login')
  })
})

//ERROR LOGIN 
app.get('/login-error', (req, res) => {
  res.sendFile('login-error.html', { root: './public/login' })
})

module.exports = app;

const PORT =  8080
const server = httpServer.listen(PORT, () => {
console.info(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

