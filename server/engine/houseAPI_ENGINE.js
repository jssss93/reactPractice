var mongoose    = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../properties');

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});[]

// mongoose.connect('mongodb://'+properties.get("mongo-db.ip")+':'+properties.get("mongo-db.port")+'/test',{ useNewUrlParser: true });
const uri = properties.get("mongoURI");
mongoose.connect(uri,{ useNewUrlParser: true });


var request = require('request-promise');
var format = require('xml-formatter');
const convert = require('xml-js');
var AddrModel = require('../model/AddrModel');
var HouseModel = require('../model/HouseModel');

var tot_cnt = 0;


findAllCode();


function findAllCode(){
    console.log("시작")
    AddrModel.aggregate([
        { $project:{법정동코드: { $substr: [ "$법정동코드", 0, 5 ] }} },
        { $group: {_id: null, 법정동코드: {$addToSet: "$법정동코드"}} },
        { $unwind : "$법정동코드" },
        { $sort : { 법정동코드 : 1 } }
        
    ]).exec().then( async (result) => {
        
        if(result.length>0){
            var startYY = 2021;
            var endYY   = 2021;

            var startMM = 6;
            var endMM = 12;

            var date =""; 

            // console.log(result.length)
            for(var yyyy = startYY; yyyy <= endYY ; yyyy++){
                for(var mm = startMM; mm<=endMM; mm++){
                    var ret_mm = mm;
                    if(mm<10){
                        ret_mm='0'+mm;
                    }
                    date = yyyy+''+ret_mm+'';
                    console.log('---------------------date :: '+date+'  START---------------------');
                    for(var i=0;i<result.length;i++){
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
        var url = 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcSHTrade'
        
        //var url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=WPXUH0cqz9hIR3splyZnK%2FavH5KDGL0KsEN0Uo1RjPHMN41OMmpGTJtp%2BOmHAp4SH%2BRS6r81VTxBEvzxE4cBsg%3D%3D'; 
        queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent(code); 
        queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent(date); 
        // queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(5000); 
        //console.log(queryParams)
        
        var req = await request({
            url: url + queryParams,
            method: 'GET'
        },   function (error, response, body) {
            return new Promise(function(resolve, reject){
                
                if (response.statusCode == 200) {
                    console.log(code+" 요청완료,   statusCode :: "+response.statusCode);
                    //console.log(i+'!!!')
                    insertData(body,code,i);
                    
                }
                resolve()
            });
        });
        
      
        
        resolve()
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
                            
                        var houseModel = new HouseModel();
                        
                        houseModel.거래금액       =(dataList[i].거래금액 != undefined) ? dataList[i].거래금액._text.replace(/,/gi,"")+"0000" : "";
                        houseModel.건축년도       =(dataList[i].건축년도 != undefined) ? dataList[i].건축년도._text: "";
                        houseModel.년             =(dataList[i].년 != undefined) ? dataList[i].년._text: "";
                        houseModel.월             =(dataList[i].월 != undefined) ? dataList[i].월._text: "";
                        houseModel.일             =(dataList[i].일 != undefined) ? dataList[i].일._text: "";
                        houseModel.법정동         =(dataList[i].법정동 != undefined) ? dataList[i].법정동._text: "";
                        houseModel.대지면적       =(dataList[i].대지면적 != undefined) ? dataList[i].대지면적._text: "";
                        houseModel.지역코드       =(dataList[i].지역코드 != undefined) ? dataList[i].지역코드._text: "";
                        houseModel.주택유형       =(dataList[i].주택유형 != undefined) ? dataList[i].주택유형._text: "";
                        houseModel.연면적       =(dataList[i].연면적 != undefined) ? dataList[i].연면적._text: "";
                        
                        
                        var mm = ((dataList[i].월 != undefined) ? dataList[i].월._text: "01");
                        var dd = ((dataList[i].일 != undefined) ? dataList[i].일._text: "01")

                        if(mm<10){
                            mm='0'+mm;
                        }
                        if(dd<10){
                            dd='0'+dd;
                        }
                        houseModel.거래일  =((dataList[i].년 != undefined) ? dataList[i].년._text: "0001")+''+mm+''+dd;
                        
                        houseModel.save(function(err){ 
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

