require("dotenv").config();    /// mandamos  a llamar dotev 
const helmet = require("helmet");
const {Sequelize}=require("sequelize");   /// mandamos  a sequelize
const express = require('express');         //import  de node 
const mysql = require('mysql2');
const bodyParser = require('body-parser');   


const app = express();   /// se mando a llamar node express
app.use(
  helmet({
    contentSecurityPolicy: false, // evita conflictos con EJS o recursos locales
    crossOriginEmbedderPolicy: false,
  })
); 



app.use(express.static(__dirname + '/views')); // para archivos estáticos
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');    // se usa para visualizar los archivos ejs 
   /// helmet se usa para generar una mayor seguridad a nivel de las cabeceras 

const db = new Sequelize(
  process.env.DB_NAME,             // en este caso lo que hace es mandamos a llamar nuestreas credenciales de nuestra bd que estan en el archivo env
  process.env.DB_USER,            // se mestablece para name de la bd ,userr y password de la bd 
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,     // aqui se validan 
    port: process.env.DB_PORT, 
    

    
    
    dialect: 'mysql',
});

// Conexion a la DB
db.authenticate()   // se usa una antentificacion para ver si si quedo la conexion a la bd 
  .then(() => console.log(' Conexión a la base de datos exitosa'))       // lo que se hace en esta parte es establlecer mensajes si se conecta o no se conecta a la bd 
  .catch(err => console.error(' Error al conectar a la base de datos:', err)); 


const port = process.env.PORT || 3037;    //lo que se hace aqui es indicar en que puerto va a salir nuestra pw 

// No necesitas pasar hostname, para que escuche en todas las interfaces
app.listen(port, () => {            // se indica en que pueto esta mandando la pagina web 
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const path = require('path');

app.get('/unam.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'unam.jpg'));    // indexamos la foto "unam" cque sirve como fondo de pantalla en index
});
app.post('/index', (req, res) => {   // aqui se lo que se hace es indexar la pagina index ,a ejs ,donde contine la parte front 
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});