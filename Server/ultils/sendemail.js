const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendmail = asyncHandler(async ({ to, html}) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        
        auth: {
            user: process.env.EMAIL_NAME, 
            pass: process.env.EMAIL_APP_PASSWORD, 
        },
    });

    
    let info = await transporter.sendMail({
        from: '"Cleanhouse" <no-relply@Cleanhouse.com>',
        to: to.join(','),
        subject: "Cleanhouse booking service", 
        html: html, 
    });
    return info
})

module.exports = sendmail