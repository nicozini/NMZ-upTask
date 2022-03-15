// Importar/Requerir Sequelize ya que contiene todos los metodos
const Sequelize = require('sequelize');

// Importar/Requerir la conexión a la db
const db = require('../config/db');

// Require NPM's
const slug = require('slug');
const shortid = require('shortid');


// Definir el modelo con Mayuscula (tabla)
const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100)
    },
    url: {
        type: Sequelize.STRING(100)
    }
}, {
    hooks: {
        beforeCreate(proyecto) {
            console.log('Antes de insertar en la DB');
            const url = slug(proyecto.nombre).trim().toLocaleLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

// Exportar/Disponibilizar el modelo creado
module.exports = Proyectos;