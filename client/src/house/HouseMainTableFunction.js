import React ,{useState} from 'react';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import useAsync from '../useAsync';
// import { Line } from "react-chartjs-2";
// import ChartLine from './ChartLine';
import Paging from './Paging';
import TableData from './TableDatas';
import common_ from '../include/common/common_js';
import ReactHTMLTableToExcel from "react-html-table-to-excel";

var domain="http://116.121.141.52";
var port="8000";
var url = domain+":"+port;

function ApiMainTableFunction(props) {
  console.log('ApiMainTableFunction')
  console.log(props)

  // Q. 커스텀훅은 props. 값들도 변경을 감지함?
  // useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
  // 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만들었습니다.
  const [sortCoulmn, setSortColumn] = useState('거래일');
  const [sortAlign, setSortAlign] = useState('1');
  function setSort(sortCoulmnPrm){
    if(sortCoulmn===sortCoulmnPrm){
      if(sortAlign==='1'){
        setSortAlign('-1');
      }else{
        setSortAlign('1');
      }
    }else{
      setSortAlign('1');
    }
    setSortColumn(sortCoulmnPrm);
  }


  async function getDatas(props) {
    var prms =  await setPrms(props,sortCoulmn,sortAlign)
    const response = await axios.post(
      url+'/house/getHouseData',
      prms
    );
    return response.data;
  }
  
  function setPrms(props,sortColumn,sortAlign){
    var prms = {};
    // var dong = $("#sub_cate").val();
    var dong = props.SubAddrCode;
    if(dong!=='' && dong !==undefined){
      prms.dong = dong;
    }
  
    // var code = $("#mid_cate").val();
    var code = props.MidAddrCode;

    if(code!=='' && code !==undefined){
      prms.code = code;
    }
    // var keyword = $("#keyword").val();
    var keyword = props.keyword;
    if(keyword!=='' && keyword !==undefined){
      prms.keyword = keyword;
    }
    prms.limit = props.limit;
    prms.page = props.page;
  
    
    // prms.start_dt = $("#start_dt").val();
    // prms.end_dt = $("#end_dt").val();
  
    prms.start_dt   = props.startDate;
    prms.end_dt     = props.endDate;

    prms.sortColumn = sortColumn;
    prms.sortAlign  = sortAlign;
  
    return prms;
  }


  const [state, refetch] = useAsync(props,getDatas, 
    [
      props.MidAddrCode,
      props.SubAddrCode,
      props.startDate,
      props.endDate,
      props.limit,
      props.page,
      props.keyword,
      // props.sortAlign,
      // props.sortColumn,
      sortAlign,
      sortCoulmn
    ]
  );

  

  // function setAlignColumn(sortAlign){
  //   alert('1')
  //   props.setAlignColumn(sortAlign)
    
  // }
  
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
      <ReactHTMLTableToExcel
            // id: ReactHTMLTableToExcel 컴포넌트의 ID
            id="tableToExcelBtn"
            // className : button의 className
            className="download-table-xls-button"
            // table : Mapping할 table Element의 id
            table="data-table"
            // filename : 엑셀 파일 명칭
            filename="tableName"
            // sheet : 엑셀 sheet의 명칭
            sheet="tableSheet"
            // buttonText : 버튼 이름
            buttonText="엑셀 다운로드"
            
      />
        <table id='data-table' className='table_className' >
          <thead>
            <tr className='table_basic'>
              <th onClick={() =>setSort('거래일')}>거래일</th>
              <th onClick={() =>setSort('법정동')}>법정동</th>
              <th onClick={() =>setSort('주택유형')}>주택유형</th>
              <th onClick={() =>setSort('연면적')}>연면적</th>
              <th onClick={() =>setSort('거래금액')}>거래금액</th>
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

{/* <button onClick={refetch}>다시 불러오기</button> */}
          
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

export default ApiMainTableFunction;