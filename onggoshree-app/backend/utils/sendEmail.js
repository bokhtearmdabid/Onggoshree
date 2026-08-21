const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Onggoshree" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    // Deliberately does NOT throw — a failed email should never break the
    // actual feature it's attached to (registration, order placement).
    // Losing an email is recoverable; losing someone's order is not.
    console.error("Email failed to send:", error.message);
  }
};

module.exports = sendEmail;