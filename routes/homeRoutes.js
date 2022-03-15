// Requerir Express
const express = require('express');
// Ejecutar Router de Express
const router = express.Router();

// Importar/Require Express Validator --> CAPAZ NO LO NECESITO SI LO TRAIGO DESDE EL MIDDLEWARE
const {body} = require('express-validator');

// Importar/Requerir Middlewares
const validationForm = require('../middlewares/validationForm');

// Importar/Require de Controllers
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    /*PROYECTOS ROUTER*/
    // Rutas Home
    router.get('/', authController.usuarioAutenticado, proyectosController.index);
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);
    // router.post('/nuevo-proyecto', validationForm, proyectosController.nuevoProyecto);
    router.post('/nuevo-proyecto', authController.usuarioAutenticado,
        //body('nombre').trim().escape().notEmpty().withMessage('Completá el nombre').isLength({ min: 4 }).withMessage('El nombre debe contener al menos 4 caracteres'), 
        proyectosController.nuevoProyecto);
    // Listar un Proyecto
    router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);
    // Actualizar el Proyecto (validaciónes deben ir en un Middleware)
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
    router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado,
        //body('nombre').trim().escape().notEmpty().withMessage('Completá el nombre').isLength({ min: 4 }).withMessage('El nombre debe contener al menos 4 caracteres'), 
        proyectosController.actualizarProyecto);
    // Eliminar el Proyecto
    router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);


    /*TAREAS ROUTER*/
    // Agregar tareas por POST
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);
    
    // Marcar tarea como competada, cambiar 0 por 1
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);

    // Eliminar una tarea
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);
    

    /*USUARIOS ROUTER*/
    // Crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // Restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);






    return router;
}