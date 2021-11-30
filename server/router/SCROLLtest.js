var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


// client.ping({
//   // ping usually has a 3000ms timeout
//   requestTimeout: 1000
// }, function (error) {
//   if (error) {
//     console.trace('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });

var result=[];
testQuery(result);
console.log(result)

async function testQuery(result){
    return new Promise(resolve => {
        var listRawData = {};
        var count =0;
        var size = 100;
        //(미리 caching했던 결과물이 있다면 search전체 읽어 결과를 바로 돌려줍니다. )
        client.search({
            index : 'apis',
            scroll: '1m',
            // from:100,
            body : {
                size:size, //한페이지에 보여줄 개수로 처리
                query: {
                    "bool": {
                        "filter": {
                            "range": {
                                "거래일": {
                                    "gte": "20210101",
                                    "lte": "20210101",
                                    "format": "yyyyMMdd"
                                }
                            }
                        }
                    }
                }
            }
        }, 
        function getMoreUntilDone(err, res){
        
            // listRawData 에 res.hits.hits의 내용을 적절히 쌓아둡니다.
            
            count += res.hits.hits.length; // listRawData 에는 중복된 데이터가 발생할 수 있으니 카운트를 별도로 처리
            // console.log(count);
            // console.log(res.hits.total.value)
            // console.log(res.hits.hits[0])
            // console.log(Math.ceil(count/size))
            var page=3;
            
            if(Math.ceil(count/size) == page){
                for(var i=0;i<res.hits.hits.length;i++){
                    // console.log(res.hits.hits.length)
                    result.push(res.hits.hits[i])
                }
                console.log("ceil")
                
                resolve(result);
            }else if(count != res.hits.total.value ){
                client.scroll({    //    아직 total count에 도달하지 않았다면 다음 데이터를 받아옵니다.
                scrollId: res._scroll_id,
                scroll:'1m'
            }, getMoreUntilDone);
                
            }else{
                
            // result.push(res.hits.hits[0]);
            //    listRawData 의 결과를 가공하여 result에 넣어두세요.
            //    이 예제에서는 day와 value, value2 형태로 데이터를 가공하여 저장했다고 가정합니다.
            //    가공된 결과를 s3, 별도의 저장소 혹은 cache에 저장하여 활용할 수 있습니다.
            
                resolve(result); // 가공된 데이터를 돌려줍니다.
            }
        });
    });
    
}