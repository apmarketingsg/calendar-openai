export default async function handler(req, res){
if(req.headers["x-cron-secret"] !== process.env.CRON_SECRET){
return res.status(401).json({ ok:false });
}
// TODO in Step 4: call /api/call?eventId=...
// For now, just confirm cron works:
res.json({ ok:true, now: new Date().toISOString() });
}
