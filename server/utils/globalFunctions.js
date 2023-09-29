import * as nodemailer from 'nodemailer';

const sendMail = (receiver, subject, text) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });
     
    let mailDetails = {
        from: process.env.EMAIL_ADDRESS,
        to: receiver,
        subject: subject,
        text: text
    };
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
};

export { sendMail };