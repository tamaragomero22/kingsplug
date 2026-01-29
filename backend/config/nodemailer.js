import nodemailer from "nodemailer";

let transporterInstance = null;

const getTransporter = () => {
  if (!transporterInstance) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
  }
  return transporterInstance;
};

export default getTransporter;
