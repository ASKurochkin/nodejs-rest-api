const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { YAHOO_PASSWORD } = process.env;
const nodemailerConfig = {
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true,
  auth: {
    user: "kurochkinac@yahoo.com",
    pass: YAHOO_PASSWORD,
  },
  logger: true,
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "kurochkinac@yahoo.com" };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
