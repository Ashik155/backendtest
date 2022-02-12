const nodeCache = require('node-cache')
const cache = new nodeCache()


module.exports = duration => (req,res,next)=>{
    if(req.method !== "GET"){
        return next();
         
    }
    const key = req.originalUrl;
    const cachedResp = cache.get(key)
    if(cachedResp){
        console.log("Returning Cached Response ")
        return res.send(cachedResp)
    }else{
        console.log("Not found any cached Response so continuing and making sure to have store response of this url ( not optimized yet !!:p")
        res.originalSend = res.send;
        res.send = body =>{
            res.originalSend(body);
            cache.set(key, body, duration)
        };
        next();
    }
}