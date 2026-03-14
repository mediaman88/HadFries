const https = require('https');

module.exports = function (req, res) {
  const q = req.query.data;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter: data' });
  }

  const url =
    'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(q);

  https
    .get(
      url,
      {
        headers: {
          'User-Agent': 'HadFries/1.0'
        }
      },
      (r) => {
        let body = '';

        r.on('data', (chunk) => {
          body += chunk;
        });

        r.on('end', () => {
          const contentType = r.headers['content-type'] || 'text/plain';
          res.setHeader('Content-Type', contentType);
          res.status(r.statusCode || 500).end(body);
        });
      }
    )
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
};
