const express = require('express');
const app=express();
const path=require('path')

app.use(express.static(path.join(__dirname,'./views')));
app.use('/node_modules',express.static(path.join(__dirname,'../node_modules')));

app.listen(4000,()=>{
    console.log("前端服务器开启：http://127.0.0.1:4000");
})