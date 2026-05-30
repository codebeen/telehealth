import 'dotenv/config';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const codeArg = process.argv.find((arg) => arg.startsWith('--code='));
const code = codeArg?.replace('--code=', '') || process.env.GOOGLE_AUTH_CODE;

async function main() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
    throw new Error('Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI');
  }

  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(JSON.stringify(tokens, null, 2));
    return;
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  console.log(url);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
