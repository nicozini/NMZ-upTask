// Puedo definir un solo export o uno por cada método
// module.exports = {
//     list: (req,res) => {
//         // TO DO
//     },
// }

// Require de los modelos necesarios
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


// Exports de los métodos del controller
exports.index = async (req,res) => {

    const usuarioId = res.locals.usuario.id;

    console.log(usuarioId);

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    res.render('index', {
        // En html locals funciona solo con la variable, en js funciona con res.locals.variableNombre
        nombrePagina: 'Proyectos' + ' ' + res.locals.year,
        proyectos
    });
}

exports.formularioProyecto = async (req,res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res) => {
    // console.log(req.body);
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    // Validad que existe algo en el input
    const {nombre} = req.body;
    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agregar un nombre al proyecto'})
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            proyectos,
            errores
        })
    } else {
        // No hay errores
        // Insertar en la DB

        const usuarioId = res.locals.usuario.id;

        // Con promesas haría esto
        // Proyectos.create({nombre})
        //     .then(() => console.log('Insertado Correctamente'))
        //     .catch((error) => console.log(error));

        // Con async y await haría esto
        // Coloco async al método y luego
        const proyecto = await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req,res,next) => {
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId: usuarioId
        }
    });

    // Consultar tareas del proyecto actual
    // El include lo puedo hacer cuando los modelos tiene relacion. Ver con vardump
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            {model: Proyectos}
        ]
    });


    if(!proyecto) return next();
    // console.log(proyecto)

    // Render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req,res,next) => {
    // Respecto al método anterior...
    // await bloquea la ejecucion de la siguiente linea de codigo hasta que no se resulve en cuestion
    // no es performante utilizar dos awaits si los codigos son independientes. Se usan promesas
    // Conclusion: utilizar promesas para multiples consultas independientes unas de otras

    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId: usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    // Render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: `Editar Proyecto`,
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req,res) => {
    // console.log(req.body);
    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    // Validad que existe algo en el input
    const {nombre} = req.body;
    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agregar un nombre al proyecto'})
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            proyectos,
            errores
        })
    } else {
        // No hay errores
        // Insertar en la DB
        const proyecto = await Proyectos.update(
            {nombre: nombre},
            {where: {id: req.params.id}}
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req,res,next) => {
    // req -> params o query, con console.log para ver datos que envío al server
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });

    // Manejo de posibles errores
    if(!resultado) {
        return next();
    }

    res.status(200).send('Proyecto eliminado correctamente!');
}