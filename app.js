const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();   /// se mando a llamar node express
app.use(express.static(__dirname + '/views')); // para archivos estáticos
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

// Credenciales para DB, aquí idealmente usa variables de entorno (más abajo te explico)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'zeus0401',
    database: process.env.DB_NAME || 'chatbot_rh',
    port: process.env.DB_PORT || '3308'
});

// Conexion a la DB
db.connect(err => {
    if (err) {
        console.log(`Error al conectar a la base de datos: ${err}`);  /// se verifica la base de datos y sus coincidencias 
    } else {
        console.log(`Conexión a la base de datos exitosa`);
    }
});


const port = process.env.PORT || 3038;

// No necesitas pasar hostname, para que escuche en todas las interfaces
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const path = require('path');


app.post('/index', (req, res) => {
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});