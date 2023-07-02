const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = (email, otp, fName, lName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification email',
        text: `
        Hi ${fName} ${lName}!
        
        Your verification code is ${otp}.
        
        Enter this code in our website to activate your BestOfShopping account.
        
        If you have any questions, send us an email ${process.env.EMAIL_USER}.
        
        We're glad you're here!
        The BestOfShopping team`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail