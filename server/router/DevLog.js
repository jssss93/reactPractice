
var express = require('express');
var router  = express.Router();
var DevLogModel            = require('../model/devLogModel');
// var common_backend = require('../public/js/common_backend')
const moment = require("moment");



// router.get('/',function(req,res){
//     console.log(req.session)
//     res.render('mng/index_mng', {"ss_user":req.session.user});
// });



////////////###개발로그 시작###//////////////////////
// router.get('/devLog',async function(req,res){
//     res.render('mng/devLog', {"ss_user":req.session.user});
// });

// function exceptEmpty(query){
//     var retQuery = {};
//     for(var i in query){
//         // console.log(i+",,"+query[i]);
//         if(query[i]!=''){
//             retQuery[i]=query[i];
//         }
//     }
//     // console.log(retQuery)
//     return retQuery;
// }

// function stringToDate(date_str)
// {
//     var yyyyMMdd = String(date_str);
//     var sYear = yyyyMMdd.substring(0,4);
//     var sMonth = yyyyMMdd.substring(5,7);
//     var sDate = yyyyMMdd.substring(8,10);
//     // console.log("sYear :"+sYear +"   sMonth :"+sMonth + "   sDate :"+sDate);
//     return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
// }

router.post('/getData',async function(req,res){
    
    //0.파라미터 세팅
    //기간검색
    var s_cond_date         = "";
    var start_date_search   = "";
    var end_date_search     = "";
    //완료구분
    var s_cond1             = "";
    //키워드검색
    var s_keyword           = "";
    var s_cond2             = "";
    console.log(req.body)
    // if(req.body.start_dt==undefined){
    //     var now             = new Date();
    //     // end_date_search     = common_backend.getDate(now);
    //     end_date_search     = '2021-12-10'
    //     var before          = new Date(now.setMonth(now.getMonth() - 3));	// 3달전
    //     // start_date_search   = common_backend.getDate(before);
    //     start_date_search   = '2021-12-01'
    //     s_cond_date         = "1";
    //     s_cond1             = "0";
    // }else{
        end_dt              = req.body.end_dt;
        start_dt            = req.body.start_dt;
        s_cond_date         = req.body.s_cond_date;
        s_cond1             = req.body.s_cond1;
        s_keyword           = req.body.s_keyword;
        s_cond2             = req.body.s_cond2;
    // }

    var query   ={};
    var query2  ={};
    var subQuery="";

    

    //1.키워드검색
    if(req.body.s_keyword!="" && req.body.s_keyword!=undefined){
        // console.log('검색')
        // (?=.*벽적골)(?=.*두산).*
        if(req.body.s_keyword.indexOf(' ') !== -1){
            var keywordList = req.body.s_keyword.split(' ');
            for(var i=0;i<keywordList.length;i++){
                subQuery +="(?=.*"+keywordList[i]+")" 
            }
            subQuery+=".*";
            query2 = {"$regex":subQuery};
            if(s_cond2=='1'){
                query.title=query2;
            }else if(s_cond2=='2'){
                query.descr=query2;
            }
        }else{
            query2 = {"$regex":req.body.s_keyword};
            if(s_cond2=='1'){
                query.title=query2;
            }else if(s_cond2=='2'){
                query.descr=query2;
            }
        }
    }

    //2.날짜검색
    var subquery2={};
    subquery2.$gte = new Date(start_dt.replace(/\./gi, '-')+"T00:00:00.000Z")
    subquery2.$lte = new Date(end_dt.replace(/\./gi, '-')+"T23:59:59.000Z")
    if(s_cond_date=='1'){
        query.reg_date = subquery2;
    }else if(s_cond_date=='2'){
        query.success_date = subquery2;
    }else if(s_cond_date=='3'){
        query.update_date = subquery2;
    }

    //3.완료구분
    if(s_cond1!="0"){
        query.success_check=s_cond1;
    }
    
    
    //4.정렬
    var sort={};
    var sortColumn ="";
    var sortAlign = -1;
    sortColumn = req.body.sortColumn;
    sortAlign = req.body.sortAlign;

    if(req.body.sortColumn=='' ){
        sortColumn ="reg_date";
        sortAlign=-1;
        sort.success_check=1
    }else{
        if(sortColumn=='reg_date'){
            sort.success_check=req.body.sortAlign;
        }
        sortColumn = req.body.sortColumn;
        sortAlign = req.body.sortAlign;
    }
    sort[sortColumn + ''] = sortAlign;


    //5. 페이징
    var page = Math.max(1, parseInt(req.body.page));
    var limit = Math.max(1, parseInt(req.body.limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;

    var skip = (page-1)*limit;
    var maxPage = 0;

    console.log(query)

    const count = await DevLogModel.count(query);
    // console.log(query)
    //6. 조회
    DevLogModel.find(query, {},  function(err, datas){    
        maxPage = Math.ceil(count/limit);
        // console.log(datas)
        res.send({datas:datas,length:count});
    }).sort(sort).skip(skip).limit(limit);
});

router.get('/devLog/register',async function(req,res){
    res.render('mng/devLogRegister', {
        datas: {seq:0},
        moment,
        "ss_user":req.session.user
    });
});

router.post('/insert',async function(req,res){
    console.log(req.body)
    var result="0";
    var devLogModel = new DevLogModel();
    devLogModel.reg_date = new Date();
    devLogModel.title = req.body.title;
    devLogModel.descr = req.body.descr;
    devLogModel.success_check = req.body.success_check;
    if(req.body.success_check=='Y'){
        devLogModel.success_date = new Date();
    }
    devLogModel.success_expect_date = req.body.success_expect_date;
    devLogModel.save(function(data){
        console.log(data)
        result = "1";
        res.send(result)
    });
});



router.get('/detail/:seq',async function(req,res){
    console.log(req.params)
    console.log("111")
    DevLogModel.findOne({seq:Number(req.params.seq)}, {_id:0},  function(err, data){ 
         
        // console.log(datas)
        // data.seq = req.params.seq;
        console.log(data)  
        res.send(data)
        // res.render('mng/devLogRegister', {
        //     datas:datas,
        //     // seq:req.query.seq,
        //     moment,
        //     "ss_user":req.session.user
        // });
    })
});

router.post('/devLog/success_update',async function(req,res){
    var result="0";
    var now = new Date();
    DevLogModel.updateOne({seq:req.body.seq}, {$set: { success_check: 'Y',success_date:now }},  function(err, datas){    
        result = "1";
        res.send(result)
    })
});

router.post('/update',async function(req,res){
    var result="0";
    var success_date="";

    var prms={
        title: req.body.title,
        descr: req.body.descr,
        success_check:req.body.success_check,
        update_date : new Date()
    }

    if(req.body.success_check=='Y' && req.body.success_date==''){
        success_date=new Date();
        prms.success_date = success_date;
    }
   
    if(req.body.success_check=='N'){
        prms.success_date = null;
    }

    console.log(req.body.seq)
    console.log(prms)
    DevLogModel.updateOne({seq:req.body.seq}, 
        {
            $set: prms
        },  function(err, datas){    
        result = "1";
        res.send(result)
    })
});
router.post('/devLog/delete',async function(req,res){
    var result="0";
    DevLogModel.deleteOne({seq:req.body.seq}, {},  function(err, datas){    
        if(err==null){
            result="1";
        }else{
            result="2";
        }
        res.send(result)
    })
});


////////////###개발로그 끝###//////////////////////

module.exports = router;