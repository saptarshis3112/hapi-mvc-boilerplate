const nodemailer = require("nodemailer");

const { environment } = require("../config");

module.exports = async (body) => {

  const transporter = nodemailer.createTransport({
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
    secure: false,
    auth: {
      user: environment.NODEMAILER_USER,
      pass: environment.NODEMAILER_PASSWORD,
    },
  });

  const { to, subject, text } = body;

  console.log(to, subject, text);

  let info = await transporter.sendMail({
    from: 'foo@example.com', // sender address
    to,
    subject,
    text,
  });

  console.log("Message sent:", info.messageId);

};
