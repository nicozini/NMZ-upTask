// Middleware para validar el ingreso del dato de un curso por parte del usuario

const {body, validationResult} = require('express-validator');
const path = require('path');

module.exports = [
    body('nombre')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Completá el nombre')
        .isLength({ min: 4 })
        .withMessage('El nombre debe contener al menos 4 caracteres')
]