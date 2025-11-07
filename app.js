require("dotenv").config();    /// mandamos  a llamar dotev 
const helmet = require("helmet");
const {Sequelize}=require("sequelize");   /// mandamos  a sequelize
const express = require('express');         //import  de node 
const mysql = require('mysql2');
const bodyParser = require('body-parser');   
const rateLimit = require("express-rate-limit");         //import  de express pero de la herramienta rate limit 
const morgan=require("morgan");          //import  de la herramienta morgan   

const app = express();   /// se mannodedo a llamar node express
app.use(morgan('combined'))      // aqui ya se esta aplicando ,con combuned lo que se hace es indicar la aplicacion de morgan de tipo de monitoreo ,si alto o bajo 
app.use(                  
  helmet({
    contentSecurityPolicy: false, // evita conflictos con EJS o recursos locales
    crossOriginEmbedderPolicy: false,    
  })
); 



app.use(express.static(__dirname + '/views')); // para archivos estáticos
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');    // se usa para visualizar los archivos ejs 
   /// helmet se usa para generar una mayor seguridad a nivel de las cabeceras 

const db = new Sequelize(
  process.env.DB_NAME,             // en este caso lo que hace es mandamos a llamar nuestreas credenciales de nuestra bd que estan en el archivo env
  process.env.DB_USER,            // se mestablece para name de la bd ,userr y password de la bd 
  process.env.DB_PASS,       // se usan los datos que se metiero en .env y con sequelize lo que se hace es manipular los datos de mysql sin usar consultas de por medio 
  {
    host: process.env.DB_HOST,     // aqui se validan 
    port: process.env.DB_PORT, 
    

    
    
    dialect: 'mysql',
});

const { DataTypes } = require('sequelize');

const Duda = db.define('Duda', {
  pregunta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'faq', // usa el nombre exacto de tu tabla en la base de datos
  timestamps: false   // desactiva createdAt / updatedAt si no los tienes
});


///--------
// Conexion a la DB
db.authenticate()   // se usa una antentificacion para ver si si quedo la conexion a la bd 
  .then(() => console.log(' Conexión a la base de datos exitosa'))       // lo que se hace en esta parte es establlecer mensajes si se conecta o no se conecta a la bd 
  .catch(err => console.error(' Error al conectar a la base de datos:', err));    // en el caso de que por algunna falla no nos podamos conectar a la base de datos ,este mensaje  va aaparecer 


const port = process.env.PORT || 3037;    //lo que se hace aqui es indicar en que puerto va a salir nuestra pw 





// Nl necesitas pasar hostname, para que escuche en todas las interfaces
app.listen(port, () => {            // lo que se hace es un app.listen para euchar el puerto que se coloco para la salida ,se indica en que pueto esta mandando la pagina web 
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const path = require('path');

// en el siguiente apartado lo que se hace es establecer un limite con base a las solicitudes que puede hacer un cliente 
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max:60 , // el numero de peticiones es de 60 por 5 minutos 
  message: "demasiadas solicitudes departe del cliente ,esperar a que se refresque ",
});

app.use(limiter);

app.get('/unam.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'unam.jpg'));    // indexamos la foto "unam" cque sirve como fondo de pantalla en index
});
app.post('/index', (req, res) => {   // aqui se lo que se hace es indexar la pagina index ,a ejs ,donde contine el apartado de fron 
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});
app.get('/api/preguntas', async (req, res) => {      
  try {
    const preguntas = await Duda.findAll({ attributes: ['pregunta'] });
    res.json(preguntas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las preguntas' });
  }
});

// Obtener la respuesta de una pregunta específica
app.post('/api/responder', async (req, res) => {         // se  usa el metodo post para obtener
  try {
    const { pregunta } = req.body;   // carga el apartado pregunta .js en el que se emplea un sequealize 
    const duda = await Duda.findOne({ where: { pregunta } });   // en vez de poner las consultas con sql ,con sequealize nos ahorramos todo ese codigo y dejamos que el haga las consultas 
                                         // internamente se encarga de realizar la consulta en la bd para encontrar la respuesta a la pregunta 
    if (!duda) {
      return res.json({ respuesta: 'No se encontró una respuesta para esa pregunta.' });    //  en caso de que la pregunta no se encuntre 
    }

    res.json({ respuesta: duda.respuesta });    // se encarga de mandar la respuesta correcta 
  } catch (err) {
    console.error(err);   // se lanza un cathc si llega a existir un error interno en la busqueda para encontrar la respuesta de la pregunta 
    res.status(500).json({ error: 'Error al buscar la respuesta' });
  }
});
process.on('uncaughtException', err => {
  console.error(' Error no capturado:', err);
});

process.on('unhandledRejection', err => {
  console.error(' Promesa rechazada sin capturar:', err);
});