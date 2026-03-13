export default async function handler(req, res) {
const query = req.query.data;
if (!query) { res.status(400).json({error:“No query”}); return; }
try {
const response = await fetch(“https://overpass-api.de/api/interpreter?data=” + encodeURIComponent(query));
const data = await response.json();
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.status(200).json(data);
} catch(e) {
res.status(500).json({error: e.message});
}
}
