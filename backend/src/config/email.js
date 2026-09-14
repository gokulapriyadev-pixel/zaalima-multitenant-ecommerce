const { Resend } = require("resend");

let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.RESEND_API_KEY || !resend) {
    console.warn("⚠️ Email not sent: RESEND_API_KEY is not configured in .env");
    return { id: "mock_skipped_no_key" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("⚠️ Resend email error:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("⚠️ Failed to send email:", err.message);
    return null;
  }
};

module.exports = {
  sendEmail,
};