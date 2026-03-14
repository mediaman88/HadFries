const https = require(“https”);

module.exports = function handler(req, res) {
const query = req.query.data;
if (!query) { res.status(400).json({error:“No query”}); return; }

const url = “https://overpass-api.de/api/interpreter?data=” + encodeURIComponent(query);

https.get(url, function(apiRes) {
let data = “”;
apiRes.on(“data”, function(chunk) { data += chunk; });
apiRes.on(“end”, function() {
try {
const parsed = JSON.parse(data);
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.status(200).json(parsed);
} catch(e) {
res.status(500).json({error: “Parse error”, raw: data.slice(0,200)});
}
});
}).on(“error”, function(e) {
res.status(500).json({error: e.message});
});
}
