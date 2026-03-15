const https = require("https");

module.exports = function(req,res){

const lat=parseFloat(req.query.lat);
const lng=parseFloat(req.query.lng);
const radius=parseFloat(req.query.radius||25);

const key=process.env.GOOGLE_MAPS_API_KEY;

if(!lat||!lng){
res.status(400).json({error:"Missing lat/lng"});
return;
}

const meters=Math.round(radius*1609.34);

const body=JSON.stringify({
textQuery:"McDonald's",
maxResultCount:20,
locationBias:{
circle:{
center:{latitude:lat,longitude:lng},
radius:meters
}
}
});

const options={
hostname:"places.googleapis.com",
path:"/v1/places:searchText",
method:"POST",
headers:{
"Content-Type":"application/json",
"X-Goog-Api-Key":key,
"X-Goog-FieldMask":"places.id,places.displayName,places.formattedAddress,places.location"
}
};

const r=https.request(options,function(up){

let data="";

up.on("data",c=>data+=c);

up.on("end",function(){

res.setHeader("Access-Control-Allow-Origin","*");
res.setHeader("Content-Type","application/json");

res.status(up.statusCode||200).end(data);

});

});

r.on("error",e=>{
res.status(500).json({error:e.message});
});

r.write(body);
r.end();

}
