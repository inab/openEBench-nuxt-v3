// server/api/email.ts
import nodemailer from "nodemailer";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log("step 1");

  console.log(body);

  const transporter = nodemailer.createTransport({
    host: "mao.bsc.es",
    port: 465,
    secure: true,
    auth: {
      user: "X",
      pass: "X",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const cleanMessage = { ...body.message };

  if (cleanMessage.details) {
    cleanMessage.details = stripHtml(cleanMessage.details);
  }

  const text = Object.entries(cleanMessage)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const html = Object.entries(body.message)
    .map(([key, value]) => {
      if (key === "details")
        return `<p><strong>${key}:</strong><br/>${value}</p>`;
      return `<p><strong>${key}:</strong> ${value}</p>`;
    })
    .join("");

  const mailOptions = {
    from: "X",
    to: "X",
    subject: body.subject,
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("its ok!: ", info);
    return { success: true, info };
  } catch (error) {
    console.log("fail: ", error);
    return { success: false, error: error.message };
  }
});

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}
