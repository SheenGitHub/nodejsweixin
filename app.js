const express = require('express')
const app = express()
const crypto = require('crypto')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)

const xml2js = require('xml2js')

app.use(bodyParser.xml())

app.get('/wx',function(req,res){
    console.log("signature:"+req.query.signature)
    console.log("timestamp:"+req.query.timestamp)
    console.log("nonce:"+req.query.nonce)
    console.log("echostr:"+req.query.echostr)
    var signature = req.query.signature
    var timestamp = req.query.timestamp
    var nonce = req.query.nonce
    var echostr = req.query.echostr
    var token = "sheen2018"
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
app.post('/wx',function(req,res){
    var bodyxml = req.body.xml
    var ToUserName = bodyxml.ToUserName[0]
    var FromUserName = bodyxml.FromUserName[0]
    var CreateTime = bodyxml.CreateTime[0]
    var MsgType = bodyxml.MsgType[0]
    var Content = bodyxml.Content[0]
    var MsgId = bodyxml.MsgId[0]

//    console.log("ToUserName:"+ToUserName)
//    console.log("FromUserName:"+FromUserName)
//    console.log("CreateTime:"+CreateTime)
//    console.log("MsgType:"+MsgType)
    console.log("Content:"+Content)
//    console.log("MsgId:"+MsgId)
    var timestamp = String(currentTimestamp());    
    var replytext = "已经收到您的消息，谢谢"
    var replytype = "text"

    var regText = /现在是几点/
    if(Content.match(regText))
    {
        replytext = String(new Date())
    }
    if(Content.match(/谢谢/))
    {
        replytext = "不客气！"
    }
    var replyobj = {
        ToUserName:FromUserName,
        FromUserName:ToUserName,
        CreateTime:timestamp,
        MsgType:replytype,
        Content:replytext
    }

    var builder = new xml2js.Builder({rootName:"xml",cdata:true})
    var reply = builder.buildObject(replyobj)
//    console.dir(reply)
//    console.log(reply)
    res.send(reply);
})
app.use(function(err,req,res,next){
    console.error(err.stack)
})
app.listen(80,()=>console.log('Example app listening on port 80!'))

function currentTimestamp(){
    var miltimestamp = Date.parse(new Date())
    return miltimestamp/1000
}
