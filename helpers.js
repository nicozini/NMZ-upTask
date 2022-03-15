// Archivo con funciones que se reutilizan en la app
// Sirven de ayuda

// Función que recibe un objeto y lo convierte en cadena. Sirve para pasarle un objeto de mi DB y ver
// como se compone
exports.vardump = (objeto) => JSON.stringify(objeto, null, 2);