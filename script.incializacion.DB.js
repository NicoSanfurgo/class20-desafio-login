//TABLE PRODUCTOS 
const {ejemplo} = require('./src/options/mariaDB.js')
const knexMAriaDB = require('knex')(ejemplo)

knexMAriaDB.schema.createTable('productos', table => {
        table.increments('id')
        table.string('title')
        table.integer('price')
        table.string('thumbnail')
    })
    .then(()=> console.log("Tabla creada Productos con exito"))
    .catch((err)=> {console.log(err);throw err})
    .finally(()=> {
        knexMAriaDB.destroy()
    })

//TABLE MENSAJES
const {optionsSQLite3} = require('./src/options/SQLite3')
const knexSQLite3 = require('knex')(optionsSQLite3)

knexSQLite3.schema.createTable('mensajes', table => {
    table.string('mail')
    table.string('mensaje')
    table.string('fyh')
})
.then(()=> console.log("Tabla creada Mensajes con exito"))
.catch((err)=> {console.log(err);throw err})
.finally(()=> {
    knexSQLite3.destroy()
})