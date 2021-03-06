import React,{useState}  from 'react';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import useAsync from '../useAsync';
// import { Line } from "react-chartjs-2";
// import ChartLine from './ChartLine';
import Paging from '../include/Paging';
import TableData from './TableDatas';
import common_ from '../include/common/common_js';
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;

function DevLogMainTable(props) {

  const [sortCoulmn, setSortColumn] = useState('reg_date');
  const [sortAlign, setSortAlign] = useState('-1');
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

  console.log('props')
  console.log(props)
  function setPrms(props){
    var prms = {};
    var s_keyword = props.s_keyword;
    if(s_keyword!=='' && s_keyword !==undefined){
      prms.s_keyword = s_keyword;
    }
    prms.limit = props.limit;
    prms.page = props.page;
  
    // prms.start_dt = $("#start_dt").val();
    // prms.end_dt = $("#end_dt").val();
    prms.start_dt = props.startDate;
    prms.end_dt = props.endDate;
  
    // if(sortColumn!==undefined && $("#sortColumn").val()!==undefined){
    //   if(sortColumn===$("#sortColumn").val()){
    //     if($("#sortAlign").val()===-1){
    //       $("#sortAlign").val(1);
    //     }else{
    //       $("#sortAlign").val(-1);
    //     }
    //   }else{
    //     $("#sortColumn").val(sortColumn);
    //     $("#sortAlign").val(-1);
    //   }
      
    // }
    // prms.sortColumn=$("#sortColumn").val();
    // prms.sortAlign=$("#sortAlign").val();

    prms.sortColumn=sortCoulmn
    prms.sortAlign=sortAlign
  
    prms.s_cond1=props.s_cond1;
    prms.s_cond2=props.s_cond2;
    prms.s_cond_date=props.s_cond_date;
  
    return prms;
  }
  
  async function getDatas(props) {
    console.log(props)
    var prms =  await setPrms(props)
    console.log(prms)
    const response = await axios.post(
      url+'/devlog/getData',
      prms
    );
    console.log(response.data)
    return response.data;
  }

  // Q. ??????????????? props. ????????? ????????? ??????????
  // useAsync ????????? Promise ??? ????????? ?????? data ??? ?????? ?????????,
  // ????????? ??? ?????? response ?????? data ???????????? ???????????? ????????? ?????? ??????????????????.
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
      props.s_cond_date,
      sortCoulmn,
      sortAlign
    ]
  );


  const { loading, data: datas, error } = state; // state.data ??? datas ???????????? ??????
  if (loading) return <><Loading /></>;
  if (error) return <div>????????? ??????????????????</div>;
  if (!datas) return null;
  if(datas.length==0){
    return <div style={{textAlign:"center"}}>data not found.</div>
  }


  return (
    <>
      <div className='table_left' >Total : {common_.addComma(datas.length)} ???  </div>
      <ReactHTMLTableToExcel
            // id: ReactHTMLTableToExcel ??????????????? ID
            id="tableToExcelBtn"
            // className : button??? className
            className="download-table-xls-button"
            // table : Mapping??? table Element??? id
            table="data-table"
            // filename : ?????? ?????? ??????
            filename="tableName"
            // sheet : ?????? sheet??? ??????
            sheet="tableSheet"
            // buttonText : ?????? ??????
            buttonText="?????? ????????????"

            
            
      />
        <table id='data-table' className='table_className' >
          <thead>
            <tr className='table_basic'>
              <th onClick={()=>setSort('title')}>??????</th>
              <th onClick={()=>setSort('reg_date')}>?????????</th>
              <th onClick={()=>setSort('success_check')}>????????????</th>
              <th onClick={()=>setSort('success_expect_date')}>???????????????</th>
              <th onClick={()=>setSort('success_date')}>?????????</th>
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
              <% var comma = addComma(addr.????????????)%>
              <% var size = calSize(addr.????????????)%>
              <% var sizeM2 = fix(addr.????????????,2)%> */}


        <TableData datas={datas.datas}/>    

{/* <button onClick={refetch}>?????? ????????????</button> */}
          
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