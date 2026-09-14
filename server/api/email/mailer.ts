// server/api/email.ts
import nodemailer from "nodemailer";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const cleanMessage = { ...body.message };

  if (cleanMessage.details) {
    cleanMessage.details = stripHtml(cleanMessage.details);
  }

  const text = Object.entries(cleanMessage)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const html = Object.entries(cleanMessage)
    .map(([key, value]) => {
      if (key === "details")
        return `<p><strong>${escapeHtml(key)}:</strong><br/>${escapeHtml(String(value))}</p>`;
      return `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</p>`;
    })
    .join("");

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_TO,
    subject: String(body.subject || ""),
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email delivery failed", error);
    return { success: false };
  }
});

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[character];
  });
}
