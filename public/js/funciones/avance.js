import Swal from 'sweetalert2';

// Resumo mi algoritmo en cuatro pasos

export const actualizarAvance = () => {
    // 1 - Seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    // Si existen tareas ejecuto
    if (tareas.length) {
        // 2 - Seleccionar tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        // 3 - Calcular el avance
        const avance = Math.round((tareasCompletas.length/tareas.length) * 100);
    
        // 4 - Mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%'

        if (avance === 100) {
            Swal.fire({
                title: '¡Completaste el proyecto!',
                text: 'Felicidades completaste todas las tareas del proyecto',
                icon: 'success'
            })    
        }
    }
}