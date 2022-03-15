import Swal from "sweetalert2";
import axios from "axios";
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

// La técnica "delegation" consiste en selectar el contenedor de los elementos, y dentro del mismo listener
// colocar con "e.target.classList.contains('nombre-de-la-clase o id')" a lo que le voy a hacer click

// Para evitar error en la consola
if(tareas) {

    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            // Busco para arriba el id de ese li 
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // request hacia /tareas/:id (esta URL la construyo internamente yo)
            const url = `${location.origin}/tareas/${idTarea}`

            axios.patch(url, {idTarea})
                .then(function(respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')) {
            const iconoTacho = e.target;
            const idTarea = iconoTacho.parentElement.parentElement.dataset.tarea;

            Swal.fire({
                title: '¿Eliminar tarea?',
                text: 'Una vez eliminada la tarea NO se podrá recuperar.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {            
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`

                    // Enviar el request de delete por axios
                    // Siempre axios recibe dos parámetros: url, lo que quiero eliminar (en este caso)
                    // En axios solo delete requiere params, los demas métodos http no
                    axios.delete(url, {params: idTarea})
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                // Eliminar el nodo del DOM
                                const li = iconoTacho.parentElement.parentElement;
                                const ul = li.parentElement.removeChild(li);
                            }

                            // Opcional, un mensaje de alerta
                            Swal.fire({
                                title: '¡Eliminada!',
                                text: respuesta.data,
                                icon: 'success'
                            })    

                            actualizarAvance();
                        })
                }
            })
        }
    });
}

export default tareas;