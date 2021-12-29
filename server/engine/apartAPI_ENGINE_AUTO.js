var mongoose    = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../properties');

//#####################################
//#####################################
//##############실행방법###############
//node apartAPI_ENGINE_AUTO.js
//#####################################
//#####################################
//#####################################

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

const uri = properties.get("mongoURI");
mongoose.connect(uri,{ useNewUrlParser: true });

// var mongo_info = process.env.ENV_MONGO_INFO == undefined ? properties.get("mongo-db.ip")+':'+properties.get("mongo-db.port") : process.env.ENV_MONGO_INFO
// mongoose.connect('mongodb://'+mongo_info+'/test?replicaSet=myRepl',{ useNewUrlParser: true });

var request = require('request-promise');
var format = require('xml-formatter');
const convert = require('xml-js');
var AddrModel = require('../model/AddrModel');
var APIModel = require('../model/APIModel');

var tot_cnt = 0;

//cron설정
var cron = require('node-cron');　

cron.schedule('0 6 * * *', function(){
    tot_cnt = 0;
    console.log('node-cron 실행 !!!!!!!!!!');
    // findAllCode();
});
findAllCode();


function findAllCode(){
    console.log("apartAPI_ENGINE_AUTO 시작==================================")
    AddrModel.aggregate([
        { $project:{법정동코드: { $substr: [ "$법정동코드", 0, 5 ] }} },
        { $group: {_id: null, 법정동코드: {$addToSet: "$법정동코드"}} },
        { $unwind : "$법정동코드" },
        { $sort : { 법정동코드 : 1 } }
        
    ]).exec().then( async (result) => {
        
        if(result.length>0){
            
            //3달전까지 자동으로 계산하여 계속하여 crontab 처리.
            var now = new Date();	// 현재 날짜 및 시간
            console.log("현재 : ", now.getFullYear()+","+(now.getMonth()+1));
            var startYY = now.getFullYear();
            var startMM = (now.getMonth()+1);

            var NMonthAgo = new Date(now.setMonth(now.getMonth() - 6)); // N 달전 날짜.	
            console.log("N달 전 : ", NMonthAgo.getFullYear()+","+(NMonthAgo.getMonth()+1));
            var endYY   = NMonthAgo.getFullYear();
            var endMM   = (NMonthAgo.getMonth()+1);
            
            var date =""; 
           
            // console.log(result.length)
            // console.log(startMM)
            // console.log(endMM)

            for(var yyyy = startYY; yyyy <= endYY ; yyyy++){
                for(var mm = endMM; mm<=startMM; mm++){
                    var ret_mm = mm;
                    if(mm<10){
                        ret_mm='0'+mm;
                    }
                    date = yyyy+''+ret_mm+'';
                    console.log('---------------------date :: '+date+'  START---------------------');
                   
                    for(var i=0;i<result.length;i++){
                        if(i==0){
                            console.log("삭제")
                            await deleteData(date);
                        }
                        var code = result[i].법정동코드;
                        await callAPI(code,date,i);
                    }
                }
            }
            

        }else{
            console.log('addr not found1')
        }
    });
       
       
        
    
 }

function callAPI(code,date,i){
    return new Promise( async function(resolve, reject) {
    
    //console.log('callAPI      code::'+code)

    //for(var i=0;i<5;i++){
        // var url = 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcSHTrade'
        
        var url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=WPXUH0cqz9hIR3splyZnK%2FavH5KDGL0KsEN0Uo1RjPHMN41OMmpGTJtp%2BOmHAp4SH%2BRS6r81VTxBEvzxE4cBsg%3D%3D'; 
        queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent(code); 
        queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent(date); 
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(5000); 
        //console.log(queryParams)
        
        var req = await request({
            url: url + queryParams,
            method: 'GET'
        },   function (error, response, body) {
            return new Promise(function(resolve, reject){
                
                if (response.statusCode == 200) {
                    console.log(code+" 요청완료,   statusCode :: "+response.statusCode);
                    insertData(body,code,i);
                }else{
                    console.log(code+" 에러발생,   statusCode :: "+response.statusCode);
                    callAPI(code,date,i);
                }
                resolve()
            });
        });
        
      
        
        resolve()
    });
}

function deleteData(date){
    return new Promise( function(resolve, reject) {

        // var apiModel = new APIModel();
        // apiModel.년             =date.substring(0,4);
        // apiModel.월             =date.substring(4,6);
        // console.log(date.substring(0,4)+".,,"+date.substring(4,6))
        // console.log(apiModel.년+",,"+apiModel.월)
        APIModel.remove({"년":date.substring(0,4),"월":date.substring(4,6)},function(err){ 

            if(err) return console.error(err);
            console.log(date+"  DELETE ------------------")
            resolve()
        });  
        
    });
}

function insertData(body,code,idx){
    //console.log(idx+'insertData START')
    return new Promise( function(resolve, reject) {

        var formattedXml = format(body);
        var result = body
        var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
        const json = JSON.parse(xmlToJson);
        var dataList = json.response.body.items.item;
        //console.log(json)
        //console.log(json.response.body.items.item)

        //일자별 반복분 ex) 20200101
        //지역별 반복분 시별로 가능. https://www.code.go.kr/index.do 참조. 
        // * 법정동 데이터는 https://www.data.go.kr/data/15063424/fileData.do 다운받을수 있다.

        
        

            

           
            if(dataList!=undefined){
                if(dataList.length>0){
                    tot_cnt+=dataList.length;
                    for(var i=0;i<dataList.length;i++){
                        try{
                            
                        var apiModel = new APIModel();
                        
                        apiModel.거래금액       =(dataList[i].거래금액 != undefined) ? dataList[i].거래금액._text.replace(/,/gi,"")+"0000" : "";
                        apiModel.건축년도       =(dataList[i].건축년도 != undefined) ? dataList[i].건축년도._text: "";
                        apiModel.년             =(dataList[i].년 != undefined) ? dataList[i].년._text: "";
                        apiModel.월             =(dataList[i].월 != undefined) ? dataList[i].월._text: "";
                        apiModel.일             =(dataList[i].일 != undefined) ? dataList[i].일._text: "";
                        apiModel.법정동         =(dataList[i].법정동 != undefined) ? dataList[i].법정동._text: "";
                        apiModel.아파트         =(dataList[i].아파트 != undefined) ? dataList[i].아파트._text: "";
                        apiModel.전용면적       =(dataList[i].전용면적 != undefined) ? dataList[i].전용면적._text: "";
                        apiModel.지번           =(dataList[i].지번 != undefined) ? dataList[i].지번._text: "";
                        apiModel.지역코드       =(dataList[i].지역코드 != undefined) ? dataList[i].지역코드._text: "";
                        apiModel.층             =(dataList[i].층 != undefined) ? dataList[i].층._text: "";
                        apiModel.해제여부       =(dataList[i].해제여부 != undefined) ? dataList[i].해제여부._text : "";
                        apiModel.해제사유발생일  =(dataList[i].해제사유발생일 != undefined) ? dataList[i].해제사유발생일._text: "";
                        
                        apiModel.도로명  =(dataList[i].도로명 != undefined) ? dataList[i].도로명._text: "";
                        apiModel.도로명건물본번호코드  =(dataList[i].도로명건물본번호코드 != undefined) ? dataList[i].도로명건물본번호코드._text: "";
                        apiModel.도로명건물부번호코드  =(dataList[i].도로명건물부번호코드 != undefined) ? dataList[i].도로명건물부번호코드._text: "";
                        apiModel.도로명시군구코드  =(dataList[i].도로명시군구코드 != undefined) ? dataList[i].도로명시군구코드._text: "";
                        apiModel.도로명일련번호코드  =(dataList[i].도로명일련번호코드 != undefined) ? dataList[i].도로명일련번호코드._text: "";
                        apiModel.도로명지상지하코드  =(dataList[i].도로명지상지하코드 != undefined) ? dataList[i].도로명지상지하코드._text: "";
                        apiModel.도로명코드  =(dataList[i].도로명코드 != undefined) ? dataList[i].도로명코드._text: "";
                        apiModel.법정동본번코드  =(dataList[i].법정동본번코드 != undefined) ? dataList[i].법정동본번코드._text: "";
                        apiModel.법정동부번코드  =(dataList[i].법정동부번코드 != undefined) ? dataList[i].법정동부번코드._text: "";
                        apiModel.법정동시군구코드  =(dataList[i].법정동시군구코드 != undefined) ? dataList[i].법정동시군구코드._text: "";
                        apiModel.법정동읍면동코드  =(dataList[i].법정동읍면동코드 != undefined) ? dataList[i].법정동읍면동코드._text: "";
                        apiModel.법정동지번코드  =(dataList[i].법정동지번코드 != undefined) ? dataList[i].법정동지번코드._text: "";
                        apiModel.일련번호  =(dataList[i].일련번호 != undefined) ? dataList[i].일련번호._text: "";
                        
                        var mm = ((dataList[i].월 != undefined) ? dataList[i].월._text: "01");
                        var dd = ((dataList[i].일 != undefined) ? dataList[i].일._text: "01")

                        if(mm<10){
                            mm='0'+mm;
                        }
                        if(dd<10){
                            dd='0'+dd;
                        }
                        apiModel.거래일  =((dataList[i].년 != undefined) ? dataList[i].년._text: "0001")+''+mm+''+dd;
                       /*
                        apiModel.거래금액       =dataList[i].거래금액._text.replace(/,/gi,"")+"0000" ;
                        apiModel.건축년도       =dataList[i].건축년도._text;
                        apiModel.년             =dataList[i].년._text;
                        apiModel.월             =dataList[i].월._text;
                        apiModel.일             =dataList[i].일._text;
                        apiModel.법정동         =dataList[i].법정동._text;
                        apiModel.아파트         =dataList[i].아파트._text;
                        apiModel.전용면적       =dataList[i].전용면적._text;
                        apiModel.지번           =dataList[i].지번._text;
                        apiModel.지역코드       =dataList[i].지역코드._text;
                        apiModel.층             =dataList[i].층._text;
                        apiModel.해제여부       =dataList[i].해제여부._text;
                        apiModel.해제사유발생일  =dataList[i].해제사유발생일._text;
        */
                        apiModel.save(function(err){ 
                            if(err) return console.error(err);
                        });  
                        }catch(err){
                            console.log("-----------error_-------------")
                            console.log(code)
                            console.log(dataList[i])
                            console.log(err.message)
                        }
                    }
                    console.log("index :: "+idx+"  code :: "+code+"   insert count :: "+dataList.length +" ////// total count :: "+tot_cnt);
                }else{
                    console.log("index :: "+idx+"  code :: "+code+"데이터없음")
                }
                
            }else{
                console.log("index :: "+idx+"  code :: "+code+"데이터없음")
            }
        
    
        //console.log(idx+'insertData END')
        resolve()
    });
    
}

