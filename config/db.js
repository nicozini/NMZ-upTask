// Para la aplicación UpTask en Node.js utiliza Sequelize como ORM y MySQL como base de datos.
// Utiliza TablePlus

const { Sequelize } = require('sequelize');

// Requerir variables de entorno
require('dotenv').config({path: 'variables.env'});

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    // host: '127.0.0.1',  es lo mismo que: host: 'localhost'
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;