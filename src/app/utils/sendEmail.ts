import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (to:string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'shatil605@gmail.com',
      pass: 'lexc cdnf gbop aqml',
    },
  })
  await transporter.sendMail({
    from: 'shatil605@gmail.com>', // sender address
    to: to, // list of receivers
    subject: 'Reset your Password within 10 mins!', // Subject line
    text: '', // plain text body
    html: html, // html body
  })
}
