const Sequelize = require('sequelize');
const db = require('../config/db');

const Proyectos = require('../models/Proyectos');

const bcryptjs = require('bcryptjs');


const Usuarios = db.define('usuarios',{ 
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido (model sequelize)'
            },
            notEmpty: {
                msg: 'El email no puede estar vacío (model sequelize)'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado (model sequelize)'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede estar vacío (model sequelize)'
            }
        }
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
}, {
    hooks: {
        beforeCreate(usuario) {
            // console.log('Creando nuevo usuario');
            // console.log(usuario);
            // El hash puedo hacerlo también en el controller
            usuario.password = bcryptjs.hashSync(usuario.password, bcryptjs.genSaltSync(10));
        }
    }
});

// Métodos personalizados (se anexan al modelo de Usuarios)
Usuarios.prototype.verificarPassword = function(password) {
    // return arroja true o false por defecto
    return bcryptjs.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;