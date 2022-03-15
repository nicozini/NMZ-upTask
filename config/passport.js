const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// 1 - Local Strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        // Por default passport espera un usuario y password
        // Los redefino con el siguiente objeto según como los tengo en el modelo (datatype)
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        // Consulta a la base de datos para validar. done sería como el next del middleware
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                })

                // Usuario SI existe pero el password es incorrecto - msg: password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Email o password incorrecto TRY IF PASSPORT'
                    })
                }
                
                // Usuario SI existe y el email y password son correctos
                return done(null, usuario);

            } catch (error) {
                // Usuario NO existe (no existe la consulta a la DB) - msg: usuario no registrado
                // done toma tres parámetros: error, usuario y un mensaje
                return done(null, false, {
                    message: 'Email o password incorrecto CATCH PASSPORT'
                })
            }
        }
    )
)

// 2 - Requisito de passport: SERIALIZAR el usuario (acceder/leer valores del objeto usuario)
// .serializeUser() toma dos parametros: usuario y callback
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// 3 - Requisito de passport: DESERIALIZAR el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// 4 - Exportar
module.exports = passport;