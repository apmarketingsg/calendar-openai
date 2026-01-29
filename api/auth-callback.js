async function kvSet(key, value){
const url = `${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
method:"POST",
headers:{ Authorization:`Bearer ${process.env.KV_REST_API_TOKEN}` },
body:value
});
if(!res.ok) throw new Error(await res.text());
}
export default async function handler(req, res){
const code = req.query.code;
const base = `https://${req.headers.host}`;
const redirectUri = `${base}/api/auth-callback`;
const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
method:"POST",
headers:{ "Content-Type":"application/x-www-form-urlencoded" },
body: new URLSearchParams({
code,
client_id: process.env.GOOGLE_CLIENT_ID,
client_secret: process.env.GOOGLE_CLIENT_SECRET,
redirect_uri: redirectUri,
grant_type: "authorization_code"
})
});
const tokens = await tokenRes.json();
if(!tokenRes.ok) return res.status(400).json(tokens);
tokens.created_at = Date.now();
await kvSet("google_tokens", JSON.stringify(tokens));
res.writeHead(302, { Location: "/" });
res.end();
}
