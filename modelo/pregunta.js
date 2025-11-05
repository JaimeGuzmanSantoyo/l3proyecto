// modelo/Pregunta.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Pregunta = sequelize.define(
    "Pregunta",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pregunta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      respuesta: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "faq", // 👈 nombre exacto de tu tabla en MySQL
      timestamps: false,
    }
  );

  return Pregunta; // 👈 antes decías "faq", pero debe ser el nombre de la variable
};
