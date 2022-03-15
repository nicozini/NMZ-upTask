const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util'); // Si algo no soporta promises, lo convierte para async await
const emailConfig = require('../config/email');

 
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: emailConfig.user, // generated ethereal user
        pass: emailConfig.pass, // generated ethereal password
    },
});

// Generar HTML
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    // const text = htmlToText.fromString(html); // Metodo DEPRECATED, usamos la siguiente linea en su lugar
    const text = htmlToText.htmlToText(html);

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'UpTask Nico <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    const enviarEmail = util.promisify(transporter.sendMail, transporter);

    return enviarEmail.call(transporter, info);
}