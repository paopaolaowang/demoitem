const express=require('express');
const app=express();
const mysql=require('mysql');
const cors=require('cors');
const bodyParser=require('body-parser');
const moment=require('moment');


app.use(cors());
const conn= mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'myheros'
})

app.use(bodyParser.urlencoded({extended:false}));

//获取所有未删除英雄的API接口
app.get('/api/getheros',(req,res)=>{
    let sqlStr='select * from heros where isdel=0';
    conn.query(sqlStr,(err,result)=>{
        if(err) return res.json({err_code:1,message:"查询错误",err})
        res.json({err_code:0,message:result});
        // conn.end();
    })
})

//根据Id更新指定的英雄信息
app.post('/api/updatehero',(req,res)=>{
    let sqlStr='update heros set ? where id=?'
    conn.query(sqlStr,[req.body,req.body.id],(err,result)=>{
        if(err) return res.json({err_code:1,message:"更新失败",affectedRows:0});
        if(result.affectedRows==0) return res.json({err_code:1,message:'没有这个英雄id',affectedRows:0});
        else res.json({err_code:0,message:"更新成功",affectedRows:1})
        // conn.end();
    })
})

//添加英雄
app.post('/api/addhero',(req,res)=>{
    let hero=req.body;
    hero.ctime=moment().format("YYYY-MM-DD HH:mm:ss");
    let sqlStr="insert into heros set ?";
    conn.query(sqlStr,hero,(err,result)=>{
        if(err) return res.json({err_code:1,message:"添加失败",affectedRows:0});
        res.json({err_code:0,message:"添加成功",affectedRows:1});
        // conn.end();
    })
})

//根据Id获取指定的英雄信息
app.get('/api/gethero',(req,res)=>{
    if(req.query.id){
        let sqlStr='select * from heros where id=?';
        conn.query(sqlStr,req.query.id,(err,result)=>{
            if(err) return res.json({err_code:1,message:"查询失败"});
            res.json({err_code:0,message:result})
            // conn.end();
        })
    }else{
        res.send('请传参');
    }
})


//根据Id删除指定的英雄信息（软删除）
app.get('/api/delhero',(req,res)=>{
    if(req.query.id){
        let sqlStr='update heros set isdel=1 where id=?';
        conn.query(sqlStr,req.query.id,(err,result)=>{
            if(err) return res.json({err_code:1,message:"删除失败",affectedRows:0});
            if(result.affectedRows==0) return res.json({err_code:1,message:'没有这个英雄id',affectedRows:0});
            else res.json({err_code:0,message:"删除成功",affectedRows:1})
            // conn.end();
        })
    }else {
        res.send('请传参');
    }

})

app.listen(5000,()=>{
    console.log('服务器开启：http://127.0.0.1:5000')
})