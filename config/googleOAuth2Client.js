require('dotenv').config()

const { google } = require('googleapis')

const googleOAuth2 = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

module.exports = googleOAuth2