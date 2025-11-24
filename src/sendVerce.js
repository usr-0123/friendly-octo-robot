const nodemailer = require("nodemailer");
const fetch = require("node-fetch");

async function getRandomVerse() {
  try {
    const response = await fetch("https://bible-api.com/random");
    const data = await response.json();
    return `${data.reference}\n${data.text}`;
  } catch (err) {
    return "Error fetching verse.";
  }
}

async function sendEmail() {
  const verse = await getRandomVerse();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Daily Bible Verse" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    subject: "Your Daily Bible Verse",
    text: verse,
  });

  console.log("Email sent:", info.messageId);
}

sendEmail().catch(console.error);
