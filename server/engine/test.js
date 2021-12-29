var request = require('request-promise');

var format = require('xml-formatter');
const convert = require('xml-js');



callAPI('11230','202108','')
callAPI('11110','202108','')
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
                console.log(body)
                if(error){
                    console.log(error)
                    console.log(code+" 에러발생 statusCode = undefined");
                    // callAPI(code,date,i);
                }else{

                
                    if (response.statusCode == 200) {
                        console.log(code+" 요청완료,   statusCode :: "+response.statusCode);
                        insertData(body,code,i);
                    }else{
                        console.log(code+" 에러발생,   statusCode :: "+response.statusCode);
                        // callAPI(code,date,i);
                    }
                }
                
                resolve()
            }); 
        });
        
        resolve()
    });
}


var tot_cnt=0;
function insertData(body,code,idx){
    // Producer = kafka.Producer,
    // client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092,127.0.0.1:9093,127.0.0.1:9094'}),
    // producer = new Producer(client);
    //console.log(idx+'insertData START')
    return new Promise( function(resolve, reject) {

        var formattedXml = format(body);
        var result = body
        var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
        // console.log(xmlToJson)
        const json = JSON.parse(xmlToJson);
        var dataList = json.response.body.items.item;
        //console.log(json)
        // console.log(json.response.body.items.item)

        //일자별 반복분 ex) 20200101
        //지역별 반복분 시별로 가능. https://www.code.go.kr/index.do 참조. 
        // * 법정동 데이터는 https://www.data.go.kr/data/15063424/fileData.do 다운받을수 있다.

        
        
        // console.log(dataList)
            

            console.log("----")
            if(dataList!=undefined ){
                console.log(dataList)
                if(!dataList.length>0){
                    var JsonArray = new Array();
                    JsonArray.push(dataList);
                    dataList = JsonArray;
                   
                }
                console.log(dataList.length)
                if(dataList.length==undefined){
                    tot_cnt+=1;
                }else{
                    tot_cnt+=dataList.length;
                }

                // console.log(dataList)

                
                console.log("index :: "+idx+"/291  code :: "+code+"   insert count :: "+dataList.length +" ////// total count :: "+tot_cnt);
                
            }else{
                console.log("index :: "+idx+"/291  code :: "+code+"데이터없음")
            }
        
    
        //console.log(idx+'insertData END')
        resolve()
    });
    
}