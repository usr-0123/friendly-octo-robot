const nodemailer = require("nodemailer");
const axios = require("axios");

async function getRandomVerse() {
  try {
    const response = await axios.get("https://bible-api.com/data/web/random");

    return response;
  } catch (err) {
    console.error("Error fetching verse:", err);
    return null;
  }
}

// HTML template function
function generateHtml(verseData) {
  if (!verseData) return "<p>Error fetching verse.</p>";

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
        <h2 style="color: #4a4a4a;">${verseData.random_verse.book}</h2>
        <h4 style="color: #777;">Chapter ${verseData.random_verse.chapter}, Verse ${verseData.random_verse.verse}</h4>
        <p style="font-size: 1.2em; color: #333; line-height: 1.6;">${verseData.random_verse.text}</p>
        <hr style="margin: 20px 0;">
        <p style="color: #555; font-size: 0.9em;">
          Translation: ${verseData.translation.name} (${verseData.translation.language}) — License: ${verseData.translation.license}
        </p>
      </div>
    </div>
  `;
}

async function sendEmail() {
  const verseData = await getRandomVerse();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `Daily Bible Verse ${process.env.EMAIL_USER}`,
    to: process.env.RECIPIENT_EMAIL,
    subject: "Your Daily Bible Verse",
    text: verseData ? `${verseData.random_verse.book} ${verseData.random_verse.chapter}:${verseData.random_verse.verse} - ${verseData.random_verse.text}` : "Error fetching verse.",
    html: generateHtml(verseData ? verseData.data : null),
  });

  console.log("Email sent:", info.messageId);
}

sendEmail().catch(console.error);
