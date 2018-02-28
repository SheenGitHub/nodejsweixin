const express = require('express')
const app = express()
const crypto = require('crypto')

app.get('/wx',function(req,res){
    console.log("signature:"+req.query.signature)
    console.log("timestamp:"+req.query.timestamp)
    console.log("nonce:"+req.query.nonce)
    console.log("echostr:"+req.query.echostr)
    var signature = req.query.signature
    var timestamp = req.query.timestamp
    var nonce = req.query.nonce
    var echostr = req.query.echostr
    var token = "xxxxxx" //replace with your token
    var list = new Array()
    list.push(token)
    list.push(timestamp)
    list.push(nonce)
    list.sort()
    var listseq = list.join("")
    console.log("listq:"+listseq)
    var sha1 = crypto.createHash("sha1")
    sha1.update(listseq)
    var result = sha1.digest("hex")
    console.log("result hex:"+ result)
    if(signature == result)
        res.send(echostr);
    else
        res.send("");
})
app.use(function(err,req,res,next){
    console.error(err.stack)
})
app.listen(80,()=>console.log('Example app listening on port 80!'))

