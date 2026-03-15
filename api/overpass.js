const https = require('https');

module.exports = function (req, res) {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radiusMiles = parseFloat(req.query.radius || '25');
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

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'Missing or invalid lat/lng' });
  }

  const radiusMeters = Math.round(radiusMiles * 1609.34);

  const body = JSON.stringify({
    textQuery: "McDonald's",
    maxResultCount: 20,
    languageCode: 'en',
    locationBias: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng
        },
        radius: radiusMeters
      }
    }
  });

  const options = {
    hostname: 'places.googleapis.com',
    path: '/v1/places:searchText',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents'
    }
  };

  const upstreamReq = https.request(options, (upstreamRes) => {
    let data = '';

    upstreamRes.on('data', (chunk) => {
      data += chunk;
    });

    upstreamRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.status(upstreamRes.statusCode || 500).end(data);
    });
  });

  upstreamReq.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });

  upstreamReq.write(body);
  upstreamReq.end();
};
