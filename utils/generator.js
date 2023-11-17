// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
import * as dotenv from "dotenv";
dotenv.config();

import sgMail from '@sendgrid/mail';
const key =process.env.SENDGRID_API_KEY
console.log(key)
sgMail.setApiKey(key)
const msg = {
    to: 'singhshubham67867@gmail.com', // Change to your recipient
    from: 'retvenssoftwares@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })