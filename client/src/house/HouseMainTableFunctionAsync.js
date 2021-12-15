import React ,{useState,useEffect} from 'react';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import useAsync from '../useAsync';
import { Line } from "react-chartjs-2";
import ChartLine from './ChartLine';
import Paging from './Paging';

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만들었습니다.



function setPrms(page,sortColumn){
  var prms = {};
  var dong = $("#sub_cate").val();
  if(dong!=='' && dong !==undefined){
    prms.dong = dong;
  }

  var code = $("#mid_cate").val();
  if(code!=='' && code !==undefined){
    prms.code = code;
  }
  var keyword = $("#keyword").val();
  if(keyword!=='' && keyword !==undefined){
    prms.keyword = keyword;
  }
  prms.limit = $("#limit").val();
  prms.page = page;

  
  prms.start_dt = $("#start_dt").val();
  prms.end_dt = $("#end_dt").val();

  if(sortColumn!==undefined && $("#sortColumn").val()!==undefined){
    if(sortColumn===$("#sortColumn").val()){
      if($("#sortAlign").val()===-1){
        $("#sortAlign").val(1);
      }else{
        $("#sortAlign").val(-1);
      }
    }else{
      $("#sortColumn").val(sortColumn);
      $("#sortAlign").val(-1);
    }
    
  }
  prms.sortColumn=$("#sortColumn").val();
  prms.sortAlign=$("#sortAlign").val();
  

  return prms;
}

async function getDatas() {
  var prms =  await setPrms(1,'거래일')
  const response = await axios.post(
    url+'/api/apart/getAPIData',
    prms
  );
  console.log(response.data)
  return response.data;
}




function ApiMainTableFunction(props) {
 
  const [state, refetch] = useAsync(getDatas, 
    [props.MidAddrCode,props.SubAddrCode,props.startDate,props.endDate,props.limit]
  );

  const { loading, data: datas, error } = state; // state.data 를 datas 키워드로 조회
  if (loading) return <><Loading /></>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!datas) return null;
  if(datas.length==0){
    return <div style={{textAlign:"center"}}>data not found.</div>
  }




    // const cjsFunc = async (아파트,법정동) => {
    //   alert(아파트+법정동)
    // }
  // props.setTotCnt(datas.length)
  
  // useEffect(() => {
  //   props.setAlignColumn(sortAlign,sortColumn)
  // }, [ sortColumn])
      //자식state 가 바뀌면 부모 state 바뀌게,
    //   useEffect(() => {
        
    // }, [startDate])

  return (
    <>
      <div className='table_left' >Total : {datas.length}  </div>
        <table className='table_className' >
          <thead>
            <tr className='table_basic'>
              <th>거래일</th>
              <th>주소</th>
              <th>아파트명(층)</th>
              <th>전용면적</th>
              <th>거래금액</th>
            </tr>
          </thead>
          <tbody id='tbody'>
            {/* <% if(addrs === null || addrs.length === 0){ %>
              <tr>
                <td colSpan=5> There is no data to show :( </td>
              </tr>
            <% } %> */}
            {/* <% 
            var idx=0;
            addrs.forEach(function(addr) {
            %>
              <% var comma = addComma(addr.거래금액)%>
              <% var size = calSize(addr.전용면적)%>
              <% var sizeM2 = fix(addr.전용면적,2)%> */}
{

datas.datas.map(data => (
  <>
            <tr className='table_basic'>
              <td>{data.년}.{data.월}.{data.일} </td>
              <td>{data.법정동}</td>
              <td>
                <div className='table_row' >{data.아파트} {data.층}
                  <a id='myChart_<%=idx%>'   className="special icon fa-search" title="차트보기"></a>
                  {/* '<%=addr.아파트%>','<%=addr.법정동%>','<%=idx%>') */}
                </div>
              </td>
              <td >
                <div className='table_row'>{data.전용면적}</div>
              </td>
              <td> 
                <div className='table_row'>{data.거래금액} ₩</div>
              </td>
            </tr>

            <tr className='table_small' >
              <td className='table_samll_td' colSpan={5} >
                <span >거래일 : </span> {data.년}.{data.월}.{data.일}<br/>
                <span >아파트명 : </span> {data.아파트} {data.층} -  {data.법정동}
                {/* <a id='myChart_<%=idx%>' onClick="mkChart('<%=addr.아파트%>','<%=addr.법정동%>','<%=idx%>')" className=" special icon fa-search" title="차트보기"></a> */}
                <br/>
                <span >전용면적 : </span> {data.전용면적}<br/>
                  <span >거래금액 : </span>
                <span>{data.거래금액} ₩</span>
              </td>
            </tr>

            <tr className='myChart_tr' >
              <td colSpan={5}  >
                <div className='myChart_email' >
                  {/* <a  onClick="sendDataEmail('<%=idx%>');">send E-Mail</a> */}
                  <a>send E-Mail</a>
                </div>
                <div className='myChart_div'  >
                  {/* <div  class="myChart" > */}
                    {/* <ChartLine 
                      아파트={data.아파트}
                      법정동 = {data.법정동}
                    /> */}
                  {/* </div> */}
                </div>
              </td>
            </tr>
            </>
))}
            

<button onClick={refetch}>다시 불러오기</button>
          </tbody>
        </table>
     <Paging/>
    </>
  );
  
}

export default ApiMainTableFunction;