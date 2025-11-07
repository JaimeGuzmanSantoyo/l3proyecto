// modelo/Pregunta.js
const { DataTypes } = require("sequelize");    //en esta linea se imparte squelize  para conectarla con mysql

module.exports = (sequelize) => {    // lo que sucede en este apartado es que se define una estrucutra para albergar la configuracion de a base de datos
  const Pregunta = sequelize.define( 
    "Pregunta",
    {
      id: {                   // aqui se escribieron las columnas que contiene nuestra tabla de datos ,se tiene que colocar lo mismo que en nuestro mysql
        type: DataTypes.INTEGER,
        primaryKey: true,       // se defiene el tipo de datos que contiene la columna id 
        autoIncrement: true,
      },                  // se carga el tipo de datos que componen a nuestra tabla ,que es id ,pregunta  y respuesta ,para Q ue se muestren 
      pregunta: {
        type: DataTypes.STRING,// se defiene el tipo de datos que contiene la columna  pregunta
        allowNull: false,
      },
      respuesta: {
        type: DataTypes.TEXT,    // se defiene el tipo de datos que contiene la columna  respuesta 
        allowNull: false,
      },
    },
    {
      tableName: "faq", //  nombre exacto de nuestra tabla en MySQL
      timestamps: false,
    }
  );

  return Pregunta; // 
};
