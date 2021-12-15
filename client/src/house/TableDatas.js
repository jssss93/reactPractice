import React ,{useState} from 'react';
import ChartLine from './ChartLine';
import common_ from '../include/common/common_js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

datas.map(data => (
          <tbody key={data._id} id={data._id}  >
            <tr  className='table_basic'>
              <td>{data.년}.{data.월}.{data.일} </td>
              <td>{data.법정동}</td>
              <td>
                <div>{data.주택유형} 
                  {/* <a 
                    id='myChart_<%=idx%>' 
                    onClick={() => showChart(data._id)}  
                    className="fontAwesome_a"
                    title="차트보기">
                        <FontAwesomeIcon icon={faChartLine} className="search" />
                    </a> */}
                </div>
              </td>
              <td >
                <div className='table_row'>{common_.fix(data.연면적,2)}m³ ({common_.calSize(data.연면적)}평)</div>
              </td>
              <td> 
                  <DataPriceColor style={''} price={data.거래금액} />
                {/* <div className='table_row'>{data.거래금액} ₩</div> */}
              </td>
            </tr>

            <tr className='table_small' >
              <td className='table_samll_td' colSpan={5} >
                <span >거래일 : </span> {data.년}.{data.월}.{data.일}<br/> 
                <span >주택유형 : </span> {data.주택유형} 
                {/* <a id='myChart_<%=idx%>' 
                  onClick={() => showChart(data._id)}  
                  className="fontAwesome_a"
                  title="차트보기"> 
                    <FontAwesomeIcon icon={faChartLine} className="search" />
                </a> */}
                <br/>
                <span >연면적 : </span> {common_.fix(data.연면적,2)}m³ ({common_.calSize(data.연면적)}평)<br/>
                  <span >거래금액 : </span>
                  <DataPriceColorSmall style={''} price={data.거래금액} />
              </td>
            </tr>

            
                    {/* <ChartLine 
                      아파트 = {data.주택유형}
                      법정동 = {data.법정동}
                      chartFlag = {data.chartFlag}
                    /> */}
                
          </tbody>
))}
     
    </>
  );
  
}

export default TableDatas;