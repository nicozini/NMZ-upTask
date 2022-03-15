import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

// Si existe el botón eliminar (para que no de error en la consola)
if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        // 1) Personalice un parámetro en html con data-proyecto-url=proyecto.url
        // 2) Con el parámetro event accedo a esa url
        // - dataset porque es la forma de acceder a atributos personalizados en htlm
        // - proyectoUrl porque cabio el guión medio por camelCase
        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: '¿Eliminar proyecto?',
            text: 'Una vez eliminado el proyecto NO se podrá recuperar.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {            
            if (result.isConfirmed) {
                // Enviar petición a Axios
                // Dos formas de sacar la URL
                // const url = `${location.origin}${location.pathname}`;
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, {
                    params: {
                        urlProyecto
                    }
                })
                .then(function(respuesta) {
                    console.log(respuesta);

                    Swal.fire(
                        '¡Proyecto Eliminado!',
                        // 'El proyecto se eliminó correctamente.' o puedo colocar,
                        respuesta.data,
                        'success'
                    );
            
                    // Redireccionar al home
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000);
                })
                .catch(() => {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar el proyecto'
                    })
                })
            }
        })
    });
}

export default btnEliminar;
