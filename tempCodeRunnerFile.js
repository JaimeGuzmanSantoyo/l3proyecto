require("dotenv").config();    /// mandamos  a llamar dotev 
const helmet = require("helmet");
const {Sequelize}=require("sequelize");   /// mandamos  a sequelize
const express = require('express');         //import  de node 
const mysql = require('mysql2');
const bodyParser = require('body-parser');   
const rateLimit = require("express-rate-limit");
const morgan=require("morgan");

const app = express();   /// se mando a llamar node express
app.use(morgan('combined'))
app.use(                  
  helmet({
    contentSecurityPolicy: false, // evita conflictos con EJS o recursos locales
    crossOriginEmbedderPolicy: false,    
  })
); 