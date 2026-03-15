const https = require('https');

module.exports = function (req, res) {
  const q = req.query.q;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GOOGLE_MAPS_API_KEY' });
  }

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter: q' });
  }

  const path = '/maps/api/geocode/json?address=' + encodeURIComponent(q) + '&key=' + encodeURIComponent(apiKey);

  https.get(
    {
      hostname: 'maps.googleapis.com',
      path
    },
    (upstreamRes) => {
      let data = '';

      upstreamRes.on('data', (chunk) => {
        data += chunk;
      });

      upstreamRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(upstreamRes.statusCode || 500).end(data);
      });
    }
  ).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
};
