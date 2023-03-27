const socket = io.connect();

//Denormalize
const authorNormalizerSchema = new normalizr.schema.Entity('author',{},{
    idAttribute: 'mail'
})
const textNormalizerSchema = new normalizr.schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema];

displayProductos();
displayMensajes();
bannerUsuario();

socket.on('updateProd', () => {
    console.log("evento updateProd llego al cliente")
    displayProductos() 
});
 
const form = document.querySelector('form');
form.addEventListener('submit', () => {
    const data = { title: form[0].value, price: form[1].value, thumbnail: form[2].value };
    fetch('/api/productos', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(socket.emit('nuevoProducto', 'Se cargo nuevo Producto!'))
        .catch(error => console.error(error))
})

displayMensajes();

socket.on('updateMsj', () => {
    console.log("evento updateMsj llego al cliente")
    displayMensajes() 
});

const botnEnviar = document.getElementById('enviar')
botnEnviar.addEventListener('click', () => {
    const mail = document.getElementById('mail')
    const nombre = document.getElementById('nombre')
    const apellido = document.getElementById('apellido')
    const edad = document.getElementById('edad')
    const alias = document.getElementById('alias')
    const avatar = document.getElementById('avatar')
    const msj = document.getElementById('mensaje')
    const data = {
        author:{ 
        mail: mail.value, 
        nombre: nombre.value, 
        apellido: apellido.value,
        edad: edad.value,
        alias: alias.value,
        avatar: avatar.value
        },
        mensaje: msj.value
    };
    fetch('/api/mensajes', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(socket.emit('nuevoMensaje', 'Se cargo nuevo Mensaje!'))
        .catch(error => console.error(error))
})

async function displayProductos() {
    const plantilla = await buscarPlantillaProducto()
    const productos = await buscarProductos()
    const html = armarHTML(plantilla, productos)
    document.getElementById('productos').innerHTML = html
}
async function displayProductosFake(mostrar) {
    const plantilla1 = await buscarPlantillaProductoFake()
    const productos_fake = await buscarProductosFake()
    const htmlfake = armarHTMLfake(plantilla1, productos_fake,mostrar)
    document.getElementById('productos_fake').innerHTML = htmlfake
}
async function displayMensajes() {
    const plantillaMsj = await buscarPlantillaMensaje()
    const mensajesNormalizado = await buscarMensajes()
    console.log(JSON.stringify(mensajesNormalizado))
    const mensajes = normalizr.denormalize(mensajesNormalizado.result,messagesNormalizerSchema, mensajesNormalizado.entities)
    console.log(JSON.stringify(mensajes))
    let rate = JSON.stringify(mensajesNormalizado).length/JSON.stringify(mensajes).length;
    const htmlMsj = armarHTMLmsj(plantillaMsj, mensajes, rate.toFixed(2)*100)
    document.getElementById('mensajes').innerHTML = htmlMsj
}

async function bannerUsuario() {
    const plantillaUser = await getPlantillaUsuario()
    const user = await getUsuario()
    const htmluser = armarHTMLuser(plantillaUser,user)
    document.getElementById('usuario').innerHTML = htmluser
}

function buscarProductos() {
    return fetch('/api/productos')
        .then(prod => prod.json())
}
function buscarProductosFake() {
    return fetch('/api/productos-test')
        .then(prodfake => prodfake.json())
}
function buscarMensajes() {
    return fetch('/api/mensajes')
        .then(msjs => msjs.json())
}

function buscarPlantillaProducto() {
     return fetch('/plantillas/productos.hbs')
         .then(respuesta => respuesta.text())
 }
function buscarPlantillaProductoFake() {
    return fetch('/plantillas/productos_fake.hbs')
        .then(respuesta1 => respuesta1.text())
}
function buscarPlantillaMensaje() {
    return fetch('/plantillas/mensajes.hbs')
        .then(respuesta2 => respuesta2.text())
}

function armarHTML(plantilla, productos) {
     const render = Handlebars.compile(plantilla);
     const html = render({ productos })
    return html
}
function armarHTMLfake(plantilla1, productos_fake,mostrar) {
    const render = Handlebars.compile(plantilla1);
    const html = render({ productos_fake, mostrar })
   return html
}
function armarHTMLmsj(plantillaMsj, mensajes, rate) {
    const render = Handlebars.compile(plantillaMsj);
    const html = render({ mensajes, rate })
   return html
}

