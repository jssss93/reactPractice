import React  from 'react';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import useAsync from '../useAsync';
// import { Line } from "react-chartjs-2";
// import ChartLine from './ChartLine';
import Paging from '../include/Paging';
import TableData from './TableDatas';
import common_ from '../include/common/common_js';


function setPrms(props,sortColumn){
  var prms = {};
  var dong = $("#sub_cate").val();
  if(dong!=='' && dong !==undefined){
    prms.dong = dong;
  }

  var code = $("#mid_cate").val();
  if(code!=='' && code !==undefined){
    prms.code = code;
  }
  var s_keyword = props.s_keyword;
  // alert(s_keyword)
  if(s_keyword!=='' && s_keyword !==undefined){
    prms.s_keyword = s_keyword;
  }
  prms.limit = $("#limit").val();
  prms.page = props.page;

  
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
  

  prms.s_cond1=props.s_cond1;
  prms.s_cond2=props.s_cond2;
  prms.s_cond_date=props.s_cond_date;

  return prms;
}

async function getDatas(props) {
  var prms =  await setPrms(props,'reg_date')
  console.log(prms)
  const response = await axios.post(
    'http://localhost:8000/devlog/getData',
    prms
  );
  console.log(response.data)
  return response.data;
}





function DevLogMainTable(props) {
  // Q. 커스텀훅은 props. 값들도 변경을 감지함?
  // useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
  // 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만들었습니다.
  const [state, refetch] = useAsync(props,getDatas, 
    [
      // props.MidAddrCode,
      // props.SubAddrCode,
      props.startDate,
      props.endDate,
      props.limit,
      props.page,
      props.s_keyword,
      props.s_cond1,
      props.s_cond2,
      props.s_cond_date
    ]
  );

  const { loading, data: datas, error } = state; // state.data 를 datas 키워드로 조회
  if (loading) return <><Loading /></>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!datas) return null;
  if(datas.length==0){
    return <div style={{textAlign:"center"}}>data not found.</div>
  }


  return (
    <>
      <div className='table_left' >Total : {common_.addComma(datas.length)} 건  </div>
        <table className='table_className' >
          <thead>
            <tr className='table_basic'>
              <th>제목</th>
              <th>등록일</th>
              <th>완료여부</th>
              <th>완료예정일</th>
              <th>완료일</th>
            </tr>
          </thead>
          
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


        <TableData datas={datas.datas}/>    

<button onClick={refetch}>다시 불러오기</button>
          
        </table>
        <Paging 
          page={props.page} 
          limit={props.limit} 
          count={datas.length} 
          setPage={props.setPage}
        />
     
    </>
  );
  
}

export default DevLogMainTable;