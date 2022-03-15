const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const { Op } = require('@sequelize/core');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const enviarEmail = require('../handlers/email');



// Función para autenticar al ausuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Función para revisar si el usuario está logueado o no (proteger ciertas rutas)
exports.usuarioAutenticado = (req,res,next) => {
    // Usuario SI autenticado
    // Me valgo de Passport
    if (req.isAuthenticated) {
        return next();
    }

    // Usuario NO autenticado
    return res.redirect('/iniciar-sesion');
}

// Función para cerrar sesión
exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    })
}

// Función para reestablecer contraseña vía token
// El token se almacena en la DB para verificar que el usuario esta solicitando
exports.enviarToken = async (req,res) => {
    // Verificar que el usuario existe
    const {email} = req.body;

    const usuario = await Usuarios.findOne({
        where: {
            // Si no aplico destructuring solo basta esta linea -> email: req.body.email
            email: email
        }
    });

    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.render('restablecer', {
            nombrePagina: 'Restablecer Contraseña',
            mensajes: req.flash()
        })
    
        // Opcion 1
        // res.redirect('/restablecer') 

        // Opcion 2
        // res.render('restablecer', {
        //     nombrePagina: 'Restablecer Contraseña',
        //     mensajes: req.flash()
        // })
    }

    // Si existe el usuario genero el token y la fecha de expiración
    // Al tener el objeto usuario arriba, simplemente le defino propiedades:
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // En lugar de un update a la db hago un save (guardado) al tener ya el objeto identificado
    await usuario.save();

    // Genero la url específica para el reset del usuario
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
    // console.log(resetUrl);

    // El reset URL es la URL que le va a llegar por mail al usuario
    // res.redirect(`/restablecer/${usuario.token}`)

    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });

    // Terminar ejecución
    req.flash('correcto', 'Verificá tu correo electrónico');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req,res) => {
    // Esto por si quiero ver que el token que recibo sea el mismo que la db
    // res.json(req.params.token)

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })

    // Si no encuentra el usuario (token incorrecto)
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    } 

    // Formulario para generar el nuevo password del usuario validado
    res.render('resetPassword', {
        nombrePagina: 'Restablecer Contraseña'
    })

    console.log(usuario);

}

// Función para cambiar el password por uno nuevo
exports.actualizarPassword = async (req,res) => {

    // Verificar token válido y fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            // Utilizo operadores de Sequelize
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // Verificar si el usuario existe
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    }

    // Si el usuario existe, hasheo el nuevo password
    usuario.password = bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // Guardo nueva instancias del objeto usuario
    await usuario.save();

    req.flash('correcto', 'Tu password se modificó correctamente');
    res.redirect('/iniciar-sesion');
}