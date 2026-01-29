async function kvGet(key){
const url = `${process.env.KV_REST_API_URL}/get/${encodeURIComponent(key)}`;
const res = await fetch(url, { headers:{ Authorization:`Bearer ${process.env.KV_REST_API_TOKEN}` }});
const data = await res.json();
return data?.result ?? null;
}
async function kvSet(key, value){
const url = `${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`;
const res = await fetch(url, { method:"POST", headers:{ Authorization:`Bearer ${process.env.KV_REST_API_TOKEN}` if(!res.ok) throw new Error(await res.text());
}
async function refreshIfNeeded(tokens){
const expiry = tokens.created_at + (tokens.expires_in * 1000);
if(Date.now() < expiry - 60000) return tokens;
const r = await fetch("https://oauth2.googleapis.com/token", {
method:"POST",
headers:{ "Content-Type":"application/x-www-form-urlencoded" },
body: new URLSearchParams({
client_id: process.env.GOOGLE_CLIENT_ID,
client_secret: process.env.GOOGLE_CLIENT_SECRET,
refresh_token: tokens.refresh_token,
grant_type: "refresh_token"
})
});
  const upd = await r.json();
if(!r.ok) throw new Error(JSON.stringify(upd));
const merged = { ...tokens, ...upd, created_at: Date.now() };
await kvSet("google_tokens", JSON.stringify(merged));
return merged;
}
export default async function handler(req, res){
const raw = await kvGet("google_tokens");
if(!raw) return res.status(401).json({ ok:false, needAuth:true });
let tokens = JSON.parse(raw);
tokens = await refreshIfNeeded(tokens);
const start = new Date(); start.setHours(0,0,0,0);
const end = new Date(); end.setHours(23,59,59,999);
const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
url.searchParams.set("timeMin", start.toISOString());
url.searchParams.set("timeMax", end.toISOString());
url.searchParams.set("singleEvents", "true");
url.searchParams.set("orderBy", "startTime");
const g = await fetch(url, { headers:{ Authorization:`Bearer ${tokens.access_token}` }});
const data = await g.json();
if(!g.ok) return res.status(400).json(data);
const events = (data.items||[]).map(e => ({
id: e.id,
title: e.summary || "(No title)",
start: e.start?.dateTime || e.start?.date
}));
res.json({ ok:true, events });
}
