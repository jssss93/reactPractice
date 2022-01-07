var mongoose    = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../properties');
// var commonjs = require('../common/common');
// const kafkajs = require('./kafka.js');
const elastic = require('elasticsearch');
const elasticClient = elastic.Client({host:'116.121.141.52:9200'});
require('events').EventEmitter.defaultMaxListeners = Infinity;
const kafka = require('kafka-node');

//#####################################
//#####################################
//##############실행방법###############
//node apartAPI_ENGINE.js 2021 3
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
// var mongo_info = process.env.ENV_MONGO_INFO == undefined ? properties.get("mongo-db.ip")+':'+properties.get("mongo-db.port") : process.env.ENV_MONGO_INFO
// mongoose.connect('mongodb://'+mongo_info+'/test',{ useNewUrlParser: true });
//20211112 =>     "mongoose": "^4.1.12"  =>     "mongoose": "^6.0.10",,
const uri = properties.get("mongoURI");
var mongo_info = process.env.ENV_MONGO_INFO == undefined ? properties.get("mongo-db.ip")+':'+properties.get("mongo-db.port") : process.env.ENV_MONGO_INFO
var mongo_user_info = properties.get("mongo-db.user")+':'+properties.get("mongo-db.password")
// mongoose.connect('mongodb://username:password@host:port/database?options...', {useNewUrlParser: true});
// console.log(mongo_user_info)
mongoose.connect('mongodb://'+mongo_user_info+'@'+mongo_info+'/test',{ useNewUrlParser: true });
// mongoose.connect(uri,{ useNewUrlParser: true });
var request = require('request-promise');
var format = require('xml-formatter');
const convert = require('xml-js');
var AddrModel = require('../model/AddrModel');
var APIModel = require('../model/APIModel');

const elasticsearch = require("elasticsearch");

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

            var startMM = 10;
            var endMM = 12;

            //node apartAPI_ENGINE.js 2021 3
            if(process.argv[2]!=null){
                
                
                startYY = process.argv[2];
                endYY   = process.argv[2];

                startMM = process.argv[3];
                endMM = process.argv[3];
            }
            
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
                    
                    //ElasticData 해당 년,월 삭제
                    await deleteElasticData(date);

                    //MongoData 해당 년,월 삭제
                    await deleteMongoData(date);
                    
                    //이런식의 코드면 위 두개에 대한 함수간 동기화는 보장 안됨.

                    // for(var i=0;i<5;i++){
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
        
        var url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=WPXUH0cqz9hIR3splyZnK%2FavH5KDGL0KsEN0Uo1RjPHMN41OMmpGTJtp%2BOmHAp4SH%2BRS6r81VTxBEvzxE4cBsg%3D%3D'; 
        queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent(code); 
        queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent(date); 
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(5000); 
        
        var req = await request({
            url: url + queryParams,
            method: 'GET',
            agent:false
        },   function (error, response, body) {
            return new Promise(function(resolve, reject){
                if(error){
                    console.log(error)
                    console.log(code+" 에러발생 statusCode = undefined");
                    callAPI(code,date,i);
                }else{

                
                    if (response.statusCode == 200) {
                        console.log(code+" 요청완료,   statusCode :: "+response.statusCode);
                        insertData(body,code,i);
                    }else{
                        console.log(code+" 에러발생,   statusCode :: "+response.statusCode);
                        callAPI(code,date,i);
                    }
                }
                
                resolve()
            }); 
        });
        
        resolve()
    });
}

//
function deleteElasticData(date){
    console.log("ElasticData삭제요청")

    // const client = new elasticsearch.Client({
    //     hosts: ["http://localhost:9200"]
    // });

    try { 
        elasticClient.deleteByQuery({
            index: 'apis',
            body: {
                "query": {
                  "bool": {
                    "must": [
                      {
                        "match": {
                          "년": date.substring(0,4)
                        }
                      },
                      {
                        "match": {
                          "월": date.substring(4,6)
                        }
                      }
                    ]
                  }
                }
            }
        }, function (error, response) {
            return new Promise( function(resolve, reject) {
                if(error){
                    console.log(error)
                    reject()
                }else{
                    console.log("ElasticData삭제완료 :: "+response.deleted+"건")
                    resolve()
                }
            });
        });
    
    } catch (err) {
        console.error(err);
    }        
        
        

}

function deleteMongoData(date){
    console.log("MongoData삭제요청")
    return new Promise( function(resolve, reject) {
        
        APIModel.remove({"년":date.substring(0,4),"월":date.substring(4,6)},function(err){ 

            if(err) return console.error(err);
            console.log("MongoData삭제완료")
            resolve();
            return new Promise( function(resolve, reject) {
                console.log("here")
                resolve();
            });

        });  
       
    });
}
Producer = kafka.Producer,
client = new kafka.KafkaClient({kafkaHost: '116.121.141.52:9092,116.121.141.52:9093,116.121.141.52:9094'}),
producer = new Producer(client);
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

        
        

            

           
            if(dataList!=undefined ){
                //1건인 경우 jsonarray 형식이아닌 json 으로 되어 length 를 받아 올 수 없으므로 아래 처리 필요.
                if(!dataList.length>0){
                    var JsonArray = new Array();
                    JsonArray.push(dataList);
                    dataList = JsonArray;
                }
                tot_cnt+=dataList.length;
                for(var i=0;i<dataList.length;i++){
                    // console.log(i+1+"번째"+dataList.length)
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

                        // console.log(apiModel.거래일+""+apiModel.아파트+""+apiModel._id.toString())
                    
                    // var elsPrm = {};
                    // elsPrm.거래금액=apiModel.거래금액;
                    // elsPrm.건축년도=apiModel.건축년도;
                    // elsPrm.년=apiModel.년;
                    // elsPrm.월=apiModel.월;
                    // elsPrm.일=apiModel.일;
                    // elsPrm.법정동=apiModel.법정동;
                    // elsPrm.아파트=apiModel.아파트;
                    // elsPrm.지번=apiModel.지번;
                    // elsPrm.층=apiModel.층;
                    // elsPrm.해제여부=apiModel.해제여부;
                    // elsPrm.해제사유발생일=apiModel.해제사유발생일;
                    // elsPrm.거래일 = apiModel.거래일;
                    // console.log(i+"----------------------------")
                    

                    // insertElasticData(elsPrm,apiModel._id.toString());    
                    callProducer(apiModel,producer,partition++)
                    apiModel.save( function(err){ 
                        

                        // console.log(apiModel)
                        if(err){ 
                            return console.error(err)
                        }else{
                            
                        }

                    });  
                    
                    
                    }catch(err){
                        console.log("-----------error_-------------")
                        console.log(code)
                        console.log(dataList[i])
                        console.log(err.message)
                    }
                }
                console.log("index :: "+idx+"/291  code :: "+code+"   insert count :: "+dataList.length +" ////// total count :: "+tot_cnt);
                
            }else{
                console.log("index :: "+idx+"/291  code :: "+code+"데이터없음")
            }
        
    
        //console.log(idx+'insertData END')
        resolve()
    });
    
}

function insertElasticData(data,id){
    // console.log("ElasticData입력요청")
    // console.log(data.거래일+""+data.아파트+""+id)
    // const client = new elasticsearch.Client({
    //     hosts: ["http://localhost:9200"]
    // });

    try { 
        elasticClient.index({
            index: 'apis',
            type: 'doc',
            id: id,
            body: data
        }, function (error, response) {
            return new Promise( function(resolve, reject) {
                if(error){
                    console.log(error)
                    reject()
                }else{
                    // console.log("ElasticData입력완료 :: ")
                    resolve()
                }
            });
        });
    
    } catch (err) {
        console.error(err);
    }        
        
        

}

async function sendProducer(producer,payloads){
    await producer.send(payloads, async function (err, data) {
        // console.log('send');
        // console.log(payloads)
        // await producer.close(function() { //꼭 닫아줘야한다.
        //     console.log('close produce'); 
        //     // console.log("끝")
        //     // resolve();
        // });

    });
}
var partition = 0;
async function callProducer(apiModel,producer,partition){
    // return new Promise((resolve) => {
       
    // payloads = [{ topic: 'logs-topic', messages: JSON.stringify(apiModel._doc)}];
    // console.log(payloads)
    // await sendProducer(producer,
    //     [
    //         { 
    //             topic: 'logs-topic',
    //             messages: JSON.stringify(apiModel._doc),
    //             partition: 0
    //         }
    //     ]
    // )


    //elstopic 이라는 토픽을 구독하는 partitions 컨슈머그룹을 위한 프로듀서 니까 elstopic 으로 전달.각파티션에따라 파티션 0~2으로 3개 로구성
    await producer.send([   
        { 
            
            // group_id:'cjs',
            // topic: 'logs-topic',
            // group_id:'grouptest',
            topic: 'elstopic',
            // group_id:'partitions',
            // topic: 'partitions',
            messages: JSON.stringify(apiModel._doc),
            // partition: (++partition==3) ? 0 : partition
            // partition: 2
            partition:partition%3
        }
    ], function (err, data) {
        // console.log(partition)
        // res.json(data);
        // console.log(err)
        // console.log(data);
    });

        // producer.on('ready', async function () {
            
            // console.log(apiModel.거래일+""+apiModel.아파트+""+apiModel._id.toString())
            // console.log('Connected');
                
        // });

        // producer.on('error', function (err) {
        //     console.error('Error occurred:', err);
            // resolve();
        // });
        // resolve();
    // });
}
