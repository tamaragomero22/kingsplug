import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

const resend = new Resend(process.env.RESEND);

async function testEmail() {
    console.log("Testing Resend with API Key:", process.env.RESEND ? "Found" : "Missing");
    console.log("Sender Email:", process.env.SENDER_EMAIL);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: "tamaragomero22@gmail.com", // testing to user's known email
            subject: "Resend Test",
            text: "This is a test email from Resend SDK.",
        });

        if (error) {
            console.error("Resend API Error:", error);
        } else {
            console.log("Resend API Success Data:", data);
        }
    } catch (err) {
        console.error("Unexpected catch block error:", err);
    }
}

testEmail();
