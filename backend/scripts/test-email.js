import dotenv from "dotenv";
// Load env vars from the parent directory's .env file
dotenv.config({ path: '../.env' });

import nodemailer from "nodemailer";

const testEmail = async () => {
    console.log("Testing email configuration...");
    console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL);
    console.log("SMTP_HOST:", process.env.SMTP_HOST || "smtp.gmail.com (default)");
    console.log("SMTP_PORT:", process.env.SMTP_PORT || "465 (default)");

    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
        console.error("ERROR: SENDER_EMAIL or SENDER_PASSWORD is missing in environment variables.");
        return;
    }

    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: port,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: process.env.SENDER_EMAIL, // Send to self
            subject: "Test Email from Kingsplug Backend",
            text: "If you receive this, your email configuration is working correctly!",
        });
        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Failed to send email.");
        console.error("Error details:", error);
    }
};

testEmail();
