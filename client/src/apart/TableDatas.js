import React ,{useState} from 'react';
// import $ from 'jquery';
// import axios from 'axios';
import ChartLine from './ChartLine';
import common_ from '../include/common/common_js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import DataPriceColor from './DataPriceColor';
import DataPriceColorSmall from './DataPriceColorSmall';

function TableDatas(props) {
  const [datas, setDatas] = useState(props.datas);
  const showChart = id => {
    setDatas(
      datas.map(data =>
        data._id === id ? { ...data, chartFlag: 'on' } : data
      )
    );

  };
  return (
    <>
{

datas.map((data,idx) => (
          <tbody key={data._id} id={data._id}  >
            <tr  className='table_basic'>
              <td>{data.년}.{data.월}.{data.일} </td>
              <td>{data.법정동}</td>
              <td>
                <div className='table_row' >{data.아파트} ({data.층}F)
                  <a 
                    id='myChart_'
                    // onClick={showChart}
                    onClick={() => showChart(data._id)}  
                    className="fontAwesome_a"
                    title="차트보기">
                        <FontAwesomeIcon icon={faChartLine} className="search" />
                    </a>
                  {/* '<%=addr.아파트%>','<%=addr.법정동%>','<%=idx%>') */}
                </div>
              </td>
              <td >
                <div className='table_row'>{common_.fix(data.전용면적,2)}m³ ({common_.calSize(data.전용면적)}평)</div>
              </td>
              <td> 
                  <DataPriceColor style={''} price={data.거래금액} />
                {/* <div className='table_row'>{data.거래금액} ₩</div> */}
              </td>
            </tr>

            <tr className='table_small' >
              <td className='table_samll_td' colSpan={5} >
                <span >거래일 : </span> {data.년}.{data.월}.{data.일}<br/> 
                <span >아파트명 : </span> {data.아파트} ({data.층}F) -  {data.법정동}
                
                <a id='myChart_'
                  onClick={() => showChart(data._id)}  
                  // className="special icon fa-search"
                  className="fontAwesome_a"
                  title="차트보기"> 
                    <FontAwesomeIcon icon={faChartLine} className="search" />
                  </a>
                {/* <a id='myChart_<%=idx%>' onClick="mkChart('<%=addr.아파트%>','<%=addr.법정동%>','<%=idx%>')" className=" special icon fa-search" title="차트보기"></a> */}
                <br/>
                <span >전용면적 : </span> {common_.fix(data.전용면적,2)}m³ ({common_.calSize(data.전용면적)}평)<br/>
                  <span >거래금액 : </span>
                  <DataPriceColorSmall style={''} price={data.거래금액} />
                {/* <span>{common_.addComma(data.거래금액)} ₩</span> */}
              </td>
            </tr>

            
                  {/* <div  class="myChart" > */}
                    <ChartLine 
                      아파트 = {data.아파트}
                      법정동 = {data.법정동}
                      chartFlag = {data.chartFlag}
                    />
                  {/* </div> */}
                
          </tbody>
))}
     
    </>
  );
  
}

export default TableDatas;