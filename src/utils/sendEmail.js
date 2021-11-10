require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');

const pathToFile = path.resolve(__dirname, '..', 'pdf/output.pdf');

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const getHtml = (customer) => {
    return  `<p style="font-size: 20px; font-family: Arial; color: #555; font-weight: 600;">
                Olá ${customer},
            </p>
            <p style="font-size: 17px; font-family: Arial; color: #777; font-weight: 400;">
                Esse é o seu recibo de compra na Xiaomi Store BH.
            </p>`
}

const sendEmail = async (emailTo, customer) => {
    const message = {
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: 'Recibo de compra de Xiaomi Store BH',
        text: 'Recibo de compra de Xiaomi Store BH',
        html: getHtml(customer),
        
        attachments: [
            { 
                filename: 'recibo.pdf',
                path: pathToFile
            }
        ]
        
    }
    await transport.sendMail(message);
}


module.exports = {sendEmail}





