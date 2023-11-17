// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
import * as dotenv from "dotenv";
dotenv.config();

const key = process.env.SENDGRID_API_KEY
sgMail.setApiKey(key)
// console.log(key)
const msg = {
    to: 'singhshubham67867@gmail.com', // Change to your recipient
    from: 'retvenssoftwares@gmail.com', // Change to your verified sender
    // subject: 'Sending with SendGrid is Fun',
    // text: 'and easy to do anywhere, even with Node.js and ReactJs',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    templateId: process.env.template_ID,
    dynamicTemplateData: {
        username: 'Retvens',
        text_here: 'Congratulations!You have successfully registered your Hotel Chain with us.We just need to check a few things first, we will let you know when your one stop hotel solution is ready to go.',
    }
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })