const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return data;
};

module.exports = {
  sendEmail,
};