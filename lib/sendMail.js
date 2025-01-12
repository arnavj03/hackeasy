import nodemailer from "nodemailer";
export default async function sendMail(email, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.NEXTAUTH_EMAIL,
      pass: process.env.NEXTAUTH_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NEXTAUTH_EMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json({ message: "Something went wrong ! - Mail" });
    }
  });
}
