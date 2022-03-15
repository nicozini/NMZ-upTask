// Express
const express = require('express');
const homeRoutes = require('./routes/homeRoutes.js');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Importar variables de entorno
require('dotenv').config({path: 'variables.env'});

// Importar/Requerir Helpers con algunas funciones
const helpers = require('./helpers');

// Crear conexión a la DB
const db = require('./config/db');
// Importar modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conexión exitosa al servidor...'))
    .catch(error => console.log(error));

// Instanciar app Express
const app = express();

// Configurar public para carga de archivos estáticos
const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));

// Habilitar PUG
app.set('view engine', 'pug');

// Habilitar bodyParser para leer req.body de forms
app.use(bodyParser.urlencoded({extended: true}));

// Agregar Express Validator a toda la app ---> ME DA ERROR. AGREGO EXPRESS VALIDATOR POR DESTRUCTURING {BODY} EN CADA MIDDLEWARE
// app.use(expressValidator());

// Habilitar carpeta de Views
app.set('views', path.join(__dirname, './views'));


// Agregar Flash Messages
// Requiere session, por ende, llamar luego del set up de session
app.use(flash());

// Configurar cookies en nuestro servidor
app.use(cookieParser());

// Session para navegar entre páginas
app.use(session({
    secret: 'shhh',
    resave: false,
    saveUninitialized: false
}));

// Inicializar instancia de Passport (luego de la instancia de Session)
app.use(passport.initialize());
app.use(passport.session());

// Pasar a locals
app.use((req,res,next) => {
    res.locals.year = new Date().getFullYear();
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    // Esto post método cerrar sesión. El usuario se almacena en req.user, lo paso a locals
    // Hago una validacion true || false
    res.locals.usuario = {...req.user} || null;
    next();
});


// Conexión de main app con routers
app.use('/', homeRoutes());

// Servidor
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});