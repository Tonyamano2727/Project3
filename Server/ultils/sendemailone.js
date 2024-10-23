const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendmail = asyncHandler(async ({ email, html }) => {
    let transporter = nodemailer.createTransport({
    
        service: 'gmail',
   
        auth: {
            user: process.env.EMAIL_NAME, 
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Cuahangdientu" <no-relply@cuahangdientu.com>', 
        to: email,
        subject: "Forgot password",
        html: html, 
    });
    return info
})

module.exports = sendmail