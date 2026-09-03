const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "192.178.158.108",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },

  tls: {
    servername: "smtp.gmail.com"
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
};

module.exports = {
  transporter,
  sendEmail
};