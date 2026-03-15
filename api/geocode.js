const https=require("https");

module.exports=function(req,res){

const q=req.query.q;

const key=process.env.GOOGLE_MAPS_API_KEY;

if(!q){
res.status(400).json({error:"missing query"});
return;
}

const url="/maps/api/geocode/json?address="+encodeURIComponent(q)+"&key="+key;

https.get({
hostname:"maps.googleapis.com",
path:url
},function(r){

let d="";

r.on("data",c=>d+=c);

r.on("end",function(){

res.setHeader("Access-Control-Allow-Origin","*");
res.setHeader("Content-Type","application/json");

res.status(200).end(d);

});

}).on("error",function(e){

res.status(500).json({error:e.message});

});

}
