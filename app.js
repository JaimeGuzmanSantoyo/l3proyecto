require("dotenv").config();
const {Sequelize}=require("sequelize");
const express = require('express');         //import  de node 
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();   /// se mando a llamar node express
app.use(express.static(__dirname + '/views')); // para archivos estáticos
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

// Credenciales para DB, aquí idealmente usa variables de entorno (más abajo te explico)
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    

       ////datos de la bd puerto ,contraseñas ,usuario .tc 
    
    
    dialect: 'mysql',
});

// Conexion a la DB
db.authenticate()
  .then(() => console.log(' Conexión a la base de datos exitosa'))
  .catch(err => console.error(' Error al conectar a la base de datos:', err));


const port = process.env.PORT || 3037;    //lo que se hace aqui es indicar en que puerto va a salir nuestra pw 

// No necesitas pasar hostname, para que escuche en todas las interfaces
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const path = require('path');

app.get('/unam.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'unam.jpg'));
});
app.post('/index', (req, res) => {
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});