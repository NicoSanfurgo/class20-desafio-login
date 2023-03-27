bannerUsuario() 

async function bannerUsuario() {
    const user = await getUsuario()
    const plantillaUser = await getPlantillaUsuario()
    const htmluser = armarHTMLuser(plantillaUser,user)
    document.getElementById('user').innerHTML = htmluser
}
function getPlantillaUsuario() {
    return fetch('/plantillas/logout-user.hbs')
        .then(respuesta3 => respuesta3.text())
}
function getUsuario() {
    return fetch('/login/user')
        .then(msjs => msjs.json())
}
function armarHTMLuser(plantillaUser,user) {
    const render = Handlebars.compile(plantillaUser,user);
    const html = render({ user })
   return html
}