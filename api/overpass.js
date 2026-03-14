var https = require(‘https’);
module.exports = function(req, res) {
var q = req.query.data;
if (!q) { res.status(400).end(‘No query’); return; }
var url = ‘https://overpass-api.de/api/interpreter?data=’ + encodeURIComponent(q);
https.get(url, function(r) {
var d = ‘’;
r.on(‘data’, function(c) { d += c; });
r.on(‘end’, function() {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Content-Type’, ‘application/json’);
res.status(200).end(d);
});
}).on(‘error’, function(e) {
res.status(500).end(e.message);
});
};
