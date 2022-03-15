const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req,res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask',
        error
    })
}

exports.crearCuenta = async (req,res) => {
    // Leer los datos
    // console.log(req.body);
    const {email, password} = req.body;

    try {
        // Crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear URL de confirmación de cuenta
        const confirmarURL = `http://${req.headers.host}/confirmar/${email}`;

        //  Crear el objeto usuario (para pasarlo a email de handler)
        const usuario = {
            email: email
        }

        // Enviar mail al usuario
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTast',
            confirmarURL,
            archivo: 'confirmar-cuenta'
        });

        // Redirigir a iniciar sesión
        req.flash('correcto', 'Enviamos un correo, verifica tu cuenta!');
        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            nombrePagina: 'Crear Cuenta en UpTask',
            mensajes: req.flash(),
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req,res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer Contraseña'
    })
}

// Función para cambiar el estado default 0 de una cuenta por activo 1
exports.confirmarCuenta = async (req,res) => {
    // Por si quiero ver el dato del correo del usuario
    // res.json(req.params.correo);

    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Si no existe usuario
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    // Si existe el usuario, cambio el estado
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}