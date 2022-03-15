const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req,res,next) => {
    // Obtengo el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    // Leer el valor del Input
    // console.log(proyecto);
    // console.log(req.body);
    const {tarea} = req.body;
    // Default: 0 para tarea inconpleta y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en DB, creando el objeto
    const resultado = await Tareas.create({
        tarea,
        estado,
        proyectoId 
    })

    if(!resultado) return next();

    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req,res,next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id: id
        }
    })

    // Cambiar el estado
    let estado = 0
    if (tarea.estado === estado) {
        estado = 1
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Estado Actualizado');
}

exports.eliminarTarea = async (req,res,next) => {
    const {id} = req.params;

    // Eliminar tarea
    const resultado = await Tareas.destroy({
        where: {
            id: id
        }
    })

    if (!resultado) return next()

    res.status(200).send('Tarea Eliminada Correctamente');
}