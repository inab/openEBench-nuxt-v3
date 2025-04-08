// server/api/email.ts
import nodemailer from 'nodemailer'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log("step 1");

  const transporter = nodemailer.createTransport({
    host: "mail.bsc.es",
    port: 465,
    secure: true,
    auth: {
      user: 'user',
      pass:'user',
    },
    tls: {
      rejectUnauthorized: false,
    }
  })

  console.log("step 2");


  const mailOptions = {
    from: `"Notificaciones" jessica`,
    to: body.to,
    subject: body.subject, 
    text: body.message,
  }

  console.log("step 3");


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("its ok!: " , info)
    return { success: true, info }
  } catch (error) {
    console.log("fail: " , error)
    return { success: false, error: error.message }
  }
})
