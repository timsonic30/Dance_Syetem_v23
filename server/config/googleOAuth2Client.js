require("dotenv").config();
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const transporter = async () => {
  const googleOAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  // set refresh token
  googleOAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  // get access token
  try {
    const accessToken = await googleOAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (err) {
    console.error("Cannot get OAuth Access Token:", err.message);
  }
};

module.exports = transporter;
