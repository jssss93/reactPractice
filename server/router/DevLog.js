
var express             = require('express');
var router              = express.Router();
var DevLogModel         = require('../model/devLogModel');
const moment            = require("moment");
var multer              = require('multer');
const PropertiesReader  = require('properties-reader');
const properties        = PropertiesReader('./properties');
var id                  = require('uuid');
var fs                  = require('fs'); 
var path                = require('path');
var mime                = require('mime');

router.post('/getData',async function(req,res){
    
    //0.파라미터 세팅
    //기간검색
    var s_cond_date         = "";
    var start_dt   = "";
    var end_dt     = "";
    //완료구분
    var s_cond1             = "";
    //키워드검색
    var s_keyword           = "";
    var s_cond2             = "";
    // console.log(req.body)
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
        query.success_expect_date = subquery2;
    }else if(s_cond_date=='3'){
        query.success_date = subquery2;
    }

    //3.완료구분
    if(s_cond1!="0"){
        query.success_check=s_cond1;
    }
    console.log(query)    
    
    //4.정렬
    var sort={};
    var sortColumn ="";
    var sortAlign = -1;
    sortColumn = req.body.sortColumn;
    sortAlign = req.body.sortAlign;

    if(req.body.sortColumn=='' ){
        sortColumn ="reg_date";
        sortAlign=-1;
        
    }else{
        // if(sortColumn=='reg_date'){
        //     sort.success_check=req.body.sortAlign;
        // }
        sortColumn = req.body.sortColumn;
        sortAlign = req.body.sortAlign;
    }
    sort.success_check=1
    sort[sortColumn + ''] = sortAlign;
    // console.log(sort)

    //5. 페이징
    var page = Math.max(1, parseInt(req.body.page));
    var limit = Math.max(1, parseInt(req.body.limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;

    var skip = (page-1)*limit;
    var maxPage = 0;

    // console.log(query)

    const count = await DevLogModel.count(query);
    // console.log(query)
    //6. 조회
    DevLogModel.find(query, {},  function(err, datas){    
        maxPage = Math.ceil(count/limit);
        // console.log(datas)
        res.send({datas:datas,length:count});
    }).sort(sort).skip(skip).limit(limit);
});


const _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, properties.get("file_path")+'/dev_log')
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname)
        cb(null, id.v4())
    }
})

router.get('/devLog/register',async function(req,res){
    res.render('mng/devLogRegister', {
        datas: {seq:0},
        moment,
        "ss_user":req.session.user
    });
});

var upload = multer({storage : _storage})
router.post('/insertFile',upload.any(), function(req,res){
    for(var i=0;i<req.files.length;i++){
        console.log(req.files[i]);
    }
    res.send("1")

});

router.post('/insert',upload.any(),async function(req,res){
    var devLogModel = new DevLogModel();
    var file_list = [];
    var fileCnt = 0;
    for(var i=0;i<req.files.length;i++){
        // console.log(req.files[i])
        var file = {};
        file.file_seq   = (fileCnt+1);
        if(req.files.length>2){
            file.file_title = req.body.file_title[fileCnt];
            file.file_descr = req.body.file_descr[fileCnt];
        }else{
            file.file_title = req.body.file_title;
            file.file_descr = req.body.file_descr;
        }
        file.org_name  = req.files[i].originalname;
        file.phy_name  = req.files[i].filename;
        file.dir       = req.files[i].destination.replace('public','');
            
        file_list.push(file); 
        fileCnt++;
        
    }
    devLogModel.file_list = file_list;
    // res.send("2")
    // return false;
    // console.log(req.body)
    var result="0";
    
    devLogModel.reg_date = new Date();
    devLogModel.title = req.body.title;
    devLogModel.descr = req.body.descr;
    devLogModel.success_check = req.body.success_check;
    if(req.body.success_check=='Y'){
        devLogModel.success_date = new Date();
    }
    devLogModel.success_expect_date = req.body.success_expect_date;
    devLogModel.save(function(data){
        // console.log(data)
        result = "1";
        res.send(result)
    });
});



router.get('/detail/:seq',async function(req,res){
    // console.log(req.params)
    // console.log("111")
    DevLogModel.findOne({seq:Number(req.params.seq)}, {_id:0},  function(err, data){ 
         
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

router.post('/success_update',async function(req,res){
    var result="0";
    var now = new Date();
    // console.log(req.body.seq)
    DevLogModel.updateOne({seq:req.body.seq}, {$set: { success_check: 'Y',success_date:now }},  function(err, datas){    
        result = "1";
        res.send(result)
    })
});

router.post('/editorImageUpload',upload.any(),async function(req,res){
    if (req.files.length > 0) {
        res.json(req.files[0]);
      }
});
router.post('/update',upload.any(),async function(req,res){
    var result="0";
    var success_date="";

    var prms={
        title: req.body.title,
        descr: req.body.descr,
        success_check:req.body.success_check,
        success_expect_date:req.body.success_expect_date,
        update_date : new Date()
    }

    if(req.body.success_check=='Y' && (req.body.success_date==''|| req.body.success_date==null)){
        success_date=new Date();
        prms.success_date = success_date;
    }
   
    if(req.body.success_check=='N'){
        prms.success_date = null;
    }

    var file_list = [];
    var fileCnt = 0;
    for(var i=0;i<req.files.length;i++){
        // console.log(req.files[i])
        var file = {};
        file.file_seq   = (fileCnt+1);
        if(req.files.length>2){
            file.file_title = req.body.file_title[fileCnt];
            file.file_descr = req.body.file_descr[fileCnt];
        }else{
            file.file_title = req.body.file_title;
            file.file_descr = req.body.file_descr;
        }
        file.org_name  = req.files[i].originalname;
        file.phy_name  = req.files[i].filename;
        file.dir       = req.files[i].destination.replace('public','');
            
        file_list.push(file); 
        fileCnt++;
        
    }
    if(req.files.length>0){
        prms.file_list = file_list;
    }
    console.log(prms)
    // prms.file_list = file_list;


    // console.log(req.body.seq)
    // console.log(prms)
    DevLogModel.updateOne(
        {seq:req.body.seq}, 
        {
            $set: prms
        },  function(err, datas){    
        result = "1";
        res.send(result)
    })
});
router.post('/delete',async function(req,res){
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
var upload_folder=__dirname.replace('router','')+properties.get("file_path")+'/dev_log/';

router.get('/downloadFile',async function(req,res){

    DevLogModel.aggregate([
        {$match:{seq:Number(req.query.seq)}}
        ,{$project:{file_list:1,_id:0}}
    ],function(err, datas){
        for(var i=0;i<datas[0].file_list.length;i++){
            // console.log(datas[0].file_list[i].file_seq)
            if(datas[0].file_list[i].file_seq==Number(req.query.file_seq)){
                var data = datas[0].file_list[i];  
                // console.log(data)
                res.setHeader('Content-Disposition', 'attachment; filename='+encodeURI(data.org_name)); // 이게 핵심 
                res.sendFile(upload_folder+data.phy_name);
                break;
            }
        }
      

        // const file_name = data.org_name;  
        // console.log(file_name)
        // console.log(upload_folder)
        // var file = upload_folder + data.phy_name;   // ex) /upload/files/sample.txt
        // console.log(file)
        // try {
        //     if (fs.existsSync(file)) { // 파일이 존재하는지 체크
                
        //     // var filename = path.basename(data.org_name); // 파일 경로에서 파일명(확장자포함)만 추출
        //     var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
           
        //     res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(file_name)); // 다운받아질 파일명 설정
        //     res.setHeader('Content-type', 'hwp'); // 파일 형식 지정
        //     console.log(res.getHeader('Content-disposition'));
        //     var filestream = fs.createReadStream(file);
        //     filestream.pipe(res);
        //     } else {
        //         res.send('해당 파일이 없습니다.');  
        //     return;
        //     }
        // } catch (e) { // 에러 발생시
        //     console.log(e);
        //     res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
        //     return;
        // }
    
    });
});


////////////###개발로그 끝###//////////////////////

module.exports = router;