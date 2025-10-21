import nodemailer from "nodemailer";

let transporterInstance = null;

const getTransporter = () => {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL, // Your Gmail address
        pass: process.env.SENDER_PASSWORD, // Your App Password
      },
    });
  }
  return transporterInstance;
};

export default getTransporter;
