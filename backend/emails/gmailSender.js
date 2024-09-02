import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pokellections.app@gmail.com',
    pass: process.env.GMAIL_APP_PW,
    // pass: '4u23rhew'
  },
});

const createMail = (recipientEmail, subject, html) => {
    return {
        from: 'pokellections.app@gmail.com',
        to: recipientEmail,
        subject,
        html
    }
};

export default async function sendGmail(recipient, subject, text) {
  const emailOptions = createMail(recipient, subject, text)
  
  return transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      return {error: true, info};
    } else {
      return {error: false};
    }
  });  
}

export const sendForgotPasswordEmail = async(recipient, token, handleResponse) => {
  const emailOptions = createMail(recipient, 'Reset Password Request', 
    `You are receiving this e-mail because you requested the account associated with this e-mail to have their password reset. 
    <br>If that sounds right, click this link to reset your password:</br>
    <br><a href="${frontendURL}/reset-password?token=${token}">${frontendURL}/reset-password?token=${token}</a></br>
    <br>If you did not request a password reset, please disregard this message.</br>
    <br>Please do not reply to this message.</br>`
  )

  transporter.sendMail(emailOptions, (error, info) => {
    let val=undefined
    if (error) {
      val=false;
    } else {
      val=true;
    }
    handleResponse(val)
  }); 
}

