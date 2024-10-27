import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.SMTP_USER);
console.log(process.env.SMTP_PORT);
console.log(process.env.SMTP_PASSWORD);
console.log(process.env.SMTP_HOST);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: Number(process.env.SMTP_PORT), 
    secure: true, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendVerificationEmail = async (email: string,id:string, verificationToken: string, verificationCode:string) => {
    const verificationUrl = `http://localhost:5173/verify-email?id=${id}&token=${verificationToken}&code=${verificationCode}`;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}. You can also verify by clicking on the following link: ${verificationUrl}`,
    };

    await transporter.sendMail(mailOptions);
};

export default { sendVerificationEmail };
