export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'missing path' });

  try {
    const r = await fetch(`https://rsshub.app/${path}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RSS reader)' },
      signal: AbortSignal.timeout(15000),
    });
    const text = await r.text();
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/xml');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
