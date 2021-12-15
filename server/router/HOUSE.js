var express = require('express');
var router  = express.Router();
var path    = require('path');
var request = require('request-promise');
var format = require('xml-formatter');
const convert = require('xml-js');
var AddrModel = require('../model/AddrModel');
var houseModel = require('../model/HouseModel');
var nodemailer = require('nodemailer');
const { resolve } = require('path');
var fs = require('fs'); 
// var commonjs = require('../common/common');
var querystring = require('querystring');

const PropertiesReader  = require('properties-reader');
const properties        = PropertiesReader('./properties');



// router.get('/house/main',function(req,res){
//     res.render('house/houseMain', {"ss_user":req.user,"data_init_date":data_init_date});
// })

router.get('/getMainAddr',function(req,res){
    AddrModel.aggregate([
        { $match : {$and:[{"시군구명":"","읍면동명":"","시도명":{$nin:["동해출장소","북부출장소","제주특별자치도"],$not:/직할시/}}]} },
        { $group: {_id: "$시도명",시도명: {$first: "$시도명"},법정동코드: {$first: "$법정동코드"}} },
        { $project : {"시도명":1,"지역코드":{ $substr: [ "$법정동코드", 0, 5 ] }} },
        { $sort : {"시도명":1}}
        
    ],function(err, addrs){

       
        if(err) return res.status(500).json({error: err});
        if(addrs.length>0){
            //console.log(addrs)
            res.send(addrs);
        }else{
            console.log('addr not found1')
        }
    });
    
});
router.post('/getMidAddr',function(req,res){
    AddrModel.find({"시도명":req.body.cate,"시군구명":{$ne:""},"읍면동명":""},{"시군구명":1,"지역코드":{ $substr: [ "$법정동코드", 0, 5 ] }},   function(err, addrs){    
        if(err) return res.status(500).json({error: err});
        if(addrs.length>0){
            //console.log(addrs)
            res.send(addrs);
        }else{
            console.log('addr not found1')
        }
    }).sort({"시군구명":1});
    
});

router.post('/getSubAddr',function(req,res){

    AddrModel.aggregate([
        { $match : {"시군구명":req.body.cate,"읍면동명":{$ne:""},"동리명":{$ne:""}} },
        { $group: {_id: "$동리명",동리명: {$first: "$동리명"},법정동코드: {$first: "$법정동코드"}} },
        { $project : {"동리명":1} },
        { $sort : {"동리명":1}}
        
    ],function(err, addrs){

    
        if(err) return res.status(500).json({error: err});
        if(addrs.length>0){
            //console.log(addrs)
            res.send(addrs);
        }else{
            console.log('addr not found1')
        }
    });
    
});
router.post('/house/autoComplete',async function(req,res){
    var match = {};
    if(req.body.sub_cate!=null){
        
        match.법정동 = req.body.sub_cate;
    }
    if(req.body.keyword!=null){
        var subMap = { $regex:req.body.keyword };
        match.주택유형 = subMap
    }

    houseModel.aggregate([
        { $match : match },
        { $limit : 10 }
    ],function(err, houses){

        if(err) return res.status(500).json({error: err});
        res.send(houses);
    });
});

router.get('/house/getHealthCheck',async function(req,res){

    try{
        await request(properties.get("ELS_host"), function (error, response, body) {
            try{
                if (!error && response.statusCode == 200) {
                    console.log("URL is OK!!") // Print the google web page.
                    res.send('_ELS');
                }else{
                    console.log("URL is not OK")
                    res.send('');
                }
            }catch(e){

            }
            return;
        })
    }catch(e){

    }
    return;
   
});

router.post('/house/gethouseData_ELS',async function(req,res){
    console.log("---------------------ELS활용--------------------------")
    
    var query={};
    var query2 ={};
    var subQuery="";
    
    if(req.body.keyword!="" && req.body.keyword!=undefined){
        // (?=.*벽적골)(?=.*두산).*
        if(req.body.keyword.indexOf(' ') !== -1){
            var keywordList = req.body.keyword.split(' ');
            for(var i=0;i<keywordList.length;i++){
                subQuery +="(?=.*"+keywordList[i]+")" 
            }
            subQuery+=".*";
            query2 = {"$regex":subQuery};
            query.주택유형=query2;
        }else{
            query2 = {"$regex":req.body.keyword};
            query.주택유형=query2;
        }
    }
    if(req.body.dong!="" &&req.body.dong!=undefined){
        //console.log("법정동 :: "+req.body.dong)
        query.법정동 = req.body.dong;
    }
    if(req.body.code!="" &&req.body.code!=undefined){
        //console.log("지역코드 :: "+req.body.code)
        query.지역코드 = req.body.code;
    }
    

        //날짜조건
    var now = new Date();	// 현재 날짜 및 시간
    var start_dt = req.body.start_dt;
    var end_dt = req.body.end_dt;
    var subquery1={};
    var subquery2={};
    subquery1.$gte = (start_dt+"").replace(/\./gi, "");
    subquery1.$lte = (end_dt+"").replace(/\./gi, "");
    subquery2.gte = (start_dt+"").replace(/\./gi, "");
    subquery2.lte = (end_dt+"").replace(/\./gi, "");
    subquery2.format = "yyyyMMdd";
    query.거래일 = subquery2;
    

    var page = Math.max(1, parseInt(req.body.page));
    var limit = Math.max(1, parseInt(req.body.limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;

    var skip = (page-1)*limit;
    var maxPage = 0;

    

    var count = await callELSTotCnt(req,'houses/_count',query);
    maxPage = Math.ceil(count/limit);

    //추출컬럼
    var project = {"년":1,"월":1,"일":1,"층":1,"법정동":1,"주택유형":1,"연면적":1,"거래금액":1};

    //정렬
    var sort={};
    var sortColumn ="";
    var sortAlign = -1;
    sortColumn = req.body.sortColumn;
    sortAlign = req.body.sortAlign;
    
    if(req.body.sortColumn==undefined ){
        sortColumn ="거래일";
        sortAlign=-1;
    }else{
        sortColumn = req.body.sortColumn;
        sortAlign = req.body.sortAlign;
    }
    sort[sortColumn + ''] = sortAlign;
    



    if(skip+limit>300000){
        query.거래일 = subquery1;
        console.log("쿼리 ~~~")
        console.log(query)
        await houseModel.find(query, project,  function(err, addrs){    
            console.log('MONGO데이터검색')
        
            if(err) return res.status(500).json({error: err});
            if(addrs.length>0){
                console.log(addrs[0])
                
            }else{
                console.log('data not found')
                addrs = [];
            }
            res.render('house/table', {
                addrs:addrs,
                currentPage:page,
                maxPage:maxPage,
                limit:limit,
                totCnt : count,
                sortColumn : sortColumn,
                sortAlign : sortAlign
                // searchType:req.query.searchType,
                // searchText:req.query.searchText
            });
            // res.send(addrs);
        }).sort(sort).skip(skip).limit(limit);
    }else{
        query.skip = skip;
        query.limit = limit;
        query.sort = sort;

    //검색조건들 추가해줘야해.
        await callELS(req,'houses/_search',query).then(result => {
            console.log('ELS데이터검색')
            if(result.length>0){
                // console.log(result[0])
            }else{
                console.log('data not found')
                result = [];
            }
            res.render('house/table_els', {
                addrs:result,
                currentPage:page,
                maxPage:maxPage,
                limit:limit,
                totCnt : count,
                sortColumn : sortColumn,
                sortAlign : sortAlign
                // searchType:req.query.searchType,
                // searchText:req.query.searchText
            });
        });
    }
});
//127.17.0.1:9200/houses/_search


//ELS REQUEST Module.
function callELS(req,url,params){
    var retData;
   
    // console.log(params)
    return new Promise(async function(resolve, reject){
        // console.log('------------------')
        // console.log(params)
        var matchFlag = false;
        var match = {};
        // console.log(params.주택유형)
        if(params.주택유형!=undefined){
            matchFlag = true;
            console.log("단어검색")
            match = {"주택유형" : params.주택유형.$regex};
            
        }
        var sortArr = [];
        var sort = params.sort;
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@")
        console.log(sort)
        if(sort.거래일==-1){
            console.log("거래일 desc")
            sortArr = [{ "년" : "desc" },{ "월" : "desc" },{ "일" : "desc" }];
        }else if(sort.거래일==1){
            sortArr = [{ "년" : "asc" },{ "월" : "asc" },{ "일" : "asc" }];
        }else{
            sortArr = [{ "년" : "desc" },{ "월" : "desc" },{ "일" : "desc" }];
            for(prop in sort)  {
                console.log('-------')
                console.log(prop + " : "  + sort[prop]);
                var sortMap ={}
                
                if(sort[prop]==-1){
                    sortMap[prop+''] = 'desc';
                }else{
                    sortMap[prop+''] = 'asc';
                }
                sortArr.push(sortMap);
            }
            // sortArr.push({})
        }
        console.log(sortArr)
        // console.log(params.query.range.거래일)
        params = {
            "from" : params.skip,
            "size" : params.limit,
            "sort" : 
            sortArr
            ,
            
            "query": {
                "bool": {
                    // "must": { "match": {"주택유형":"풍림"} },
                    // "must": { "match": {"주택유형":"풍림"} },
                    "filter": {
                        "range": {
                            "거래일": {
                                "gte": params.거래일.gte,
                                "lte": params.거래일.lte,
                                "format": "yyyyMMdd"
                            }
                        }
                    }
                }
            }
              
          };

        if(matchFlag){
            // console.log("변경")
            // console.log(params.주택유형)
            params.query.bool.must = {"match":  match};
        }
        var req = await request({
            url: properties.get("ELS_host")+url ,
                        
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(params)
        },   function (error, response, body) {
            return new Promise(function(resolve, reject){
                if (response.statusCode == 200) {
                    console.log("statusCode :: "+response.statusCode);
                    // console.log(body)
                    body = JSON.parse(body);
                    // insertData(body,code,i);
                    
                    retData = body.hits.hits
                }
                resolve(retData)
            });
        });
        resolve(retData)
    });
}
function callELSTotCnt(req,url,params){
    console.log('개수검색')
    var retData;
    return new Promise(async function(resolve, reject){
        console.log('------------------')
        console.log(params)
        var matchFlag = false;
        var match = {};
        console.log(params.주택유형)
        if(params.주택유형!=undefined){
            matchFlag = true;
            console.log("단어검색")
            match = {"주택유형" : params.주택유형.$regex};
            
        }
        // console.log(params.query.range.거래일)
        params = {
            // "query": {
            //     "range": {
            //         "거래일": {
            //             "gte": params.거래일.gte,
            //             "lte": params.거래일.lte,
            //             "format": "yyyyMMdd"
            //         }
            //     }
            // }
            
            "query": {
                "bool": {
                    // "must": { "match": {"주택유형":"풍림"} },
                    // "must": { "match": {"주택유형":"풍림"} },
                    "filter": {
                        "range": {
                            "거래일": {
                                "gte": params.거래일.gte,
                                "lte": params.거래일.lte,
                                "format": "yyyyMMdd"
                            }
                        }
                    }
                }
            }
              
          };

        if(matchFlag){
            console.log("변경")
            console.log(params.주택유형)
            params.query.bool.must = {"match":  match};
        }
        var req = await request({
            url: properties.get("ELS_host")+url ,
                        
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(params)
        },   function (error, response, body) {
            return new Promise(function(resolve, reject){
                if (response.statusCode == 200) {
                    // console.log("statusCode :: "+response.statusCode);
                    // console.log(body)
                    // insertData(body,code,i);
                    body = JSON.parse(body);
                }
                retData=body.count;
                resolve(retData)
            });
        });
        resolve(retData);
    });
}
// function callELSTotCnt(req,url,params){
//     return new Promise(function(resolve, reject){
//         console.log('------------------')
//         var http = require("http");
//         var options = {
//             hostname: '127.17.0.1',
//             port:'9200',
//             path: url,
//             method: 'get',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         };

//         var post_data = querystring.stringify(params);

//         var datas = [];
//         var req = http.request(options, function(res) {
//             // console.log('Status: ' + res.statusCode);
//             // console.log('Headers: ' + JSON.stringify(res.headers));
//             res.setEncoding('utf8');
//             res.on('data', function (body) {
//                 var json = JSON.parse(body);
//                 // console.log('Body: ' + json.hits.total.value);
//                 datas = json.count;
//                 // console.log(datas)//Array 형식의 데이터 추출
//                 resolve(datas);
//             });
//         });
//         req.on('error', function(e) {
//             resolve(datas);
//             console.log('problem with request: ' + e.message);
//         });
        
//         req.write(
//             post_data
//         );
//         req.end();
   
//     });
// }
router.post('/getHouseData',async function(req,res){
    var query={};
    var query2 ={};
    var subQuery="";
    
    if(req.body.keyword!="" && req.body.keyword!=undefined){
        // (?=.*벽적골)(?=.*두산).*
        if(req.body.keyword.indexOf(' ') !== -1){
            var keywordList = req.body.keyword.split(' ');
            for(var i=0;i<keywordList.length;i++){
                subQuery +="(?=.*"+keywordList[i]+")" 
            }
            subQuery+=".*";
            query2 = {"$regex":subQuery};
            query.주택유형=query2;
        }else{
            query2 = {"$regex":req.body.keyword};
            query.주택유형=query2;
        }
    }
    if(req.body.dong!="" &&req.body.dong!=undefined){
        //console.log("법정동 :: "+req.body.dong)
        query.법정동 = req.body.dong;
    }
    if(req.body.code!="" &&req.body.code!=undefined){
        //console.log("지역코드 :: "+req.body.code)
        query.지역코드 = req.body.code;
    }
    

        //날짜조건
    var now = new Date();	// 현재 날짜 및 시간
    var start_dt = req.body.start_dt;
    var end_dt = req.body.end_dt;
    var subquery2={};

    function getDate(date){
        var yyyy = date.getFullYear();
        var mm = date.getMonth()+1;
        var dd = '';
        if(mm<10){
            mm='0'+mm;
        }
        if(mm===13){
            mm='01';
        }
        if(dd<10){
            dd='0'+dd;
        }
        dd = date.getDate();
    
        return yyyy+''+mm+''+dd;
    }


    subquery2.$gte = getDate(new Date(start_dt)).replace(/\./gi, "");
    subquery2.$lte = getDate(new Date(end_dt)).replace(/\./gi, "");
    query.거래일 = subquery2;

    var page = Math.max(1, parseInt(req.body.page));
    var limit = Math.max(1, parseInt(req.body.limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;
  
    var skip = (page-1)*limit;
    var maxPage = 0;

    var count = await houseModel.count(query);
    maxPage = Math.ceil(count/limit);

    var idToString = { "$toString": "$_id" }
    //추출컬럼
    var project = {
        "_id": idToString ,
        "년":1,"월":1,"일":1,"층":1,"법정동":1,"주택유형":1,"연면적":1,"거래금액":1,"chartFlag":"off"};

    //정렬
    var sort={};
    var sortColumn ="";
    var sortAlign = -1;
    sortColumn = req.body.sortColumn;
    sortAlign = req.body.sortAlign;
    
    if(req.body.sortColumn==undefined ){
        sortColumn ="거래일";
        sortAlign=-1;
    }else{
        sortColumn = req.body.sortColumn;
        sortAlign = req.body.sortAlign;
    }
    sort[sortColumn + ''] = sortAlign;

    console.log(query)

    houseModel.find(query, project,  function(err, addrs){    
       
        if(err) return res.status(500).json({error: err});
        if(addrs.length>0){
            console.log(addrs[0])
            
        }else{
            console.log('data not found')
            addrs = [];
        }
        // res.render('house/table', {
        //     addrs:addrs,
        //     currentPage:page,
        //     maxPage:maxPage,
        //     limit:limit,
        //     totCnt : count,
        //     sortColumn : sortColumn,
        //     sortAlign : sortAlign
        //     // searchType:req.query.searchType,
        //     // searchText:req.query.searchText
        //   });
        res.send({datas:addrs,length:count});
    }).sort(sort).skip(skip).limit(limit);
    
});
router.post('/house/getChartData', function(req,res){

    //날짜조건
    var start_dt = req.body.start_dt;
    var end_dt = req.body.end_dt;
    var subquery2={};

    subquery2.$gte = (req.body.start_dt+"").replace(/\./gi, "");
    subquery2.$lte = (end_dt+"").replace(/\./gi, "");
    console.log(req.body.주택유형)
    console.log(req.body.법정동)
    console.log(subquery2)
    
    houseModel.aggregate([
        { $match :{"주택유형":req.body.주택유형,"법정동":req.body.법정동,"거래일":subquery2}},
        { $project : {"거래금액":1,"거래일":{$substr:["$거래일",0,6]}}},
        { $group: {_id : "$거래일","거래금액":{$avg:"$거래금액"},"최대거래금액":{$max:"$거래금액"},"최소거래금액":{$min:"$거래금액"},"거래건수":{$sum:1}}},
        { $project : {_id:1,"거래금액":{$floor:"$거래금액"},최대거래금액:1,최소거래금액:1,거래건수:1}},
        { $sort : {_id:1} }
        
    ]).exec().then( async (result,err) => {
        if(err) return res.status(500).json({error: err});
        if(result.length>0){
            //console.log(addrs)
            res.send(result);
        }else{
            console.log('result not found')
        }

    });
});


router.post('/house/sendChartMail', async function(req,res){
    var uri = req.body.href.split(',')[1];
    var imgName = req.body.imgDown;
    var filePath = "public/data/chartImg/"+imgName;
    var subquery2={};
    subquery2.$gte = (req.body.start_dt+"").replace(/\./gi, "");
    subquery2.$lte = (req.body.end_dt+"").replace(/\./gi, "");

    houseModel.aggregate([
        { $match :{"주택유형":req.body.aptName,"법정동":req.body.dongName,"거래일":subquery2}},
        { $project : {"거래금액":1,"거래일":1,"법정동":1,"연면적":1,"층":1}},
        { $sort : {"거래일":-1} }
        
    ]).exec().then( async (result,err) => {
        var str ="<style> th{text-align:right;width:10%;} </style>"
        str += "<h2>["+req.body.dongName+"]"+req.body.aptName+"_실거래 내역 ("+result.length+"건)</h2>";
        str+="<table style='border:1px solid black; width:20%;'>"
        str+="<th>거래일</th><th>거래금액(평)</th><th>층</th>";
        // ;
        for(var i=0;i<result.length;i++){
            str+="<tr>";
            // str+="<td >"+commonjs.changeDate(result[i].거래일)+"</td>";
            // str+="<td style='text-align:right;'>"+commonjs.addComma(result[i].거래금액)+"₩ ("+(result[i].연면적/3.3).toFixed(0)+"P)</td>";
            str+="<td style='text-align:right;'>"+result[i].층+"F</td>";
            str+="</tr>";
        }
        str+="</table>";
        // str+='<div><img src="'+req.body.href+'"/></div>';
        
         fs.writeFile(filePath, uri, 'base64', async function(err) {
            if (err) {
                console.log(err);
            }else{
                var transporter = nodemailer.createTransport({
                    service:'gmail',
                    auth: {
                        user : 'choec53@gmail.com',
                        pass : '1q2w3e4r#'
                    }
                });
                
                var mailOption = {
                    from: 'choec53@gmail.com',
                    to: 'choec53@gmail.com',
                    subject: "["+req.body.dongName+"]"+req.body.aptName+"_실거래 내역"+".",
                    html: str,
                    attachments:[
                        {
                        filename:imgName,
                        path:'public/data/chartImg/'+imgName
                        }
                    ]
                };
                console.log(mailOption)
                var msg = "";
                transporter.sendMail(mailOption, await function (err, info) {
                    return new Promise(function(resolve, reject){
                    if (err) {
                        msg = "Fail to Send Mail"
                        console.error('Send Mail error : ', err);
                    }
                    else {
                        fs.unlink(filePath, function(err) {
                            console.log(`${filePath} 를 정상적으로 삭제했습니다`);
                        });
                        msg = "Send Mail";
                        console.log('Message sent : ', info);
                    }
                    res.send({msg:msg});
                    resolve()
                    });
                });
            }
        });
    });
});



router.post('/sendMail2', async function(req,res){

    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user : 'choec53@gmail.com',
            pass : '1q2w3e4r#'
        }
    });

    var mailOption = {
        from: 'choec53@gmail.com',
        to: 'choec53@gmail.com',
        subject:  '문의입니다. ',
        text: 'tel : '+req.body.tel+'\n email : '+req.body.email+'\n message : '+req.body.message 
    };
    var msg = "";
    transporter.sendMail(mailOption, await function (err, info) {
        return new Promise(function(resolve, reject){
        if (err) {
            msg = "Fail to Send Mail"
            console.error('Send Mail error : ', err);
        }
        else {
            
            msg = "Send Mail";
            console.log('Message sent : ', info);
        }
        res.send({msg:msg});
        resolve()
        });
    });
    
});




module.exports = router; //이 라인으로 인해 다른소스에서도 router 를 가져다 쓸 수 있다.