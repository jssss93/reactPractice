import React, { useEffect, useReducer } from 'react';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        length:null,
        error: null
      };
    case 'SUCCESS':
        return {
          loading: false,
          data: action.data.datas,
          length: action.data.length,
          error: null
        };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        length:null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}


function setPrms(page,sortColumn){
  var prms = {};
  var dong = $("#sub_cate").val();
  if(dong!='' && dong !=undefined){
    prms.dong = dong;
  }

  var code = $("#mid_cate").val();
  if(code!='' && code !=undefined){
    prms.code = code;
  }
  var keyword = $("#keyword").val();
  if(keyword!='' && keyword !=undefined){
    prms.keyword = keyword;
  }
  prms.limit = $("#limit").val();
  prms.page = page;

  
  prms.start_dt = $("#start_dt").val();
  prms.end_dt = $("#end_dt").val();

  if(sortColumn!=undefined && $("#sortColumn").val()!=undefined){
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

function ApiMainTable() {

  
  const [state, dispatch] = useReducer(reducer, {
      loading: false,
      data: null,
      length:null,
      error: null
    });

  const fetchApartData = async () => {

    dispatch({ type: 'LOADING' });

    var prms =  await setPrms(1,null)
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getAPIData',
        prms
      );
      dispatch({ type: 'SUCCESS' , data: response.data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchApartData();
  }, []);

  const { loading, data: datas,length:length, error } = state; // state.data 를 MainAddrs 키워드로 조회

  if (loading) return <><Loading /></>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!datas) return null;

  return (
    <>
      <div class="table-wrapper">
        <input type='hidden' name='sortColumn' id='sortColumn' value='<%= sortColumn %>'/>
        <input type='hidden' name='sortAlign' id='sortAlign' value='<%= sortAlign %>'/>

        <hr />

        <div class='table_left' >Total : {length} </div>
        <div class='table_right' >
        목록수 : 
        <select class='table_limit' id = 'limit'>
          {/* <option value="10"  <% if(limit === 10){ %> selected<% }%> >10</option>
          <option value="100" <% if(limit === 100){ %> selected<% }%> >100</option>
          <option value="500" <% if(limit === 500){ %> selected<% }%> >500</option>
          <option value="1000"<% if(limit === 1000){ %> selected<% }%> >1000</option> */}
        </select>
        </div>
        <table class='table_class' >
          <thead>
            <tr class='table_basic'>
              <th onclick='setTable(1,"거래일");' >거래일</th>
              <th onclick='setTable(1,"법정동");'>주소</th>
              <th onclick='setTable(1,"아파트");'>아파트명(층)</th>
              <th onclick='setTable(1,"전용면적");' >전용면적</th>
              <th onclick='setTable(1,"거래금액");' >거래금액</th>
            </tr>
          </thead>
          <tbody id='tbody'>
            {/* <% if(addrs === null || addrs.length === 0){ %>
              <tr>
                <td colspan=5> There is no data to show :( </td>
              </tr>
            <% } %> */}
            {/* <% 
            var idx=0;
            addrs.forEach(function(addr) {
            %>
              <% var comma = addComma(addr.거래금액)%>
              <% var size = calSize(addr.전용면적)%>
              <% var sizeM2 = fix(addr.전용면적,2)%> */}
{datas.map(data => (
            <tr class='table_basic'>
              <td>{data.년}.{data.월}.{data.일}</td>
              <td>{data.법정동}</td>
              <td>
                <div class='table_row' >{data.아파트} {data.층}
                  <a id='myChart_<%=idx%>' onclick="mkChart('<%=addr.아파트%>','<%=addr.법정동%>','<%=idx%>')" class=" special icon fa-search" title="차트보기"></a>
                </div>
              </td>
              <td >
                <div class='table_row'>{data.전용면적}</div>
              </td>
              <td> 
                <div class='table_row'>{data.거래금액} ₩</div>
                </td>
            </tr>
))}

{datas.map(data => (
<>
            <tr class='table_small' >
              <td class='table_samll_td' colspan='5' >
                <span >거래일 : </span> {data.년}.{data.월}.{data.일}<br/>
                <span >아파트명 : </span> {data.아파트} {data.층} -  {data.법정동}
                <a id='myChart_<%=idx%>' onclick="mkChart('<%=addr.아파트%>','<%=addr.법정동%>','<%=idx%>')" class=" special icon fa-search" title="차트보기"></a>
                <br/>
                <span >전용면적 : </span> {data.전용면적}<br/>
                  <span >거래금액 : </span>
                <span>{data.거래금액} ₩</span>
              </td>
            </tr>

            <tr class='myChart_tr' >
              <td colspan='5'  >
                <div class='myChart_email' >
                  <a  onclick="sendDataEmail('<%=idx%>');">send E-Mail</a>
                </div>
                <div class='myChart_div'  >
                  <canvas id='cnavas_<%=idx%>' class="myChart" ></canvas>
                </div>
              </td>
            </tr>
</>
))}
          </tbody>
        </table>
      </div>
    </>
  );
  
}

export default ApiMainTable;