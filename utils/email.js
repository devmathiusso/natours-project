const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1) Create a transporter

  /**
   * Gmail transporter if needed
   */
  // const transporter = nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  //   // You'll need to activate in gmail "Less Secure App" option
  // });

  /**
   * Mailtrap transporter
   */
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Victor Mathiusso <dev.mathiusso@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
