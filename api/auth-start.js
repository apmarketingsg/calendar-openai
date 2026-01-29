export default async function handler(req, res) {
const base = `https://${req.headers.host}`;
const redirectUri = `${base}/api/auth-callback`;
const params = new URLSearchParams({
client_id: process.env.GOOGLE_CLIENT_ID,
redirect_uri: redirectUri,
response_type: "code",
access_type: "offline",
prompt: "consent",
scope: [
"https://www.googleapis.com/auth/calendar.readonly",
"https://www.googleapis.com/auth/calendar.events"
].join(" ")
});
res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
res.end();
}
