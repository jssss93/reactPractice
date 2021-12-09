import React ,{useState} from 'react';
// import $ from 'jquery';
// import axios from 'axios';
// import ChartLine from './ChartLine';
import common_ from '../include/common/common_js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
// import DataPriceColor from './DataPriceColor';
// import DataPriceColorSmall from './DataPriceColorSmall';
import { Link } from "react-router-dom";

function TableDatas(props) {
  const [datas, setDatas] = useState(props.datas);
 
  return (
    <>
{

datas.map(data => (
          <tbody key={data._id} id={data._id}  >
            <tr  className='table_basic'>
              <td><Link to={`/devLog/detail/${data.seq}`} >{data.title}</Link> </td>
              <td>{data.reg_date}</td>
              <td>{data.success_check}</td>
              <td>{data.success_expect_date}</td>
              <td>{data.success_date}</td>
            </tr>

            <tr className='table_small' >
              <td className='table_samll_td' colSpan={5} >
                <span >제목 : </span> {data.title}<br/> 
                <span >등록일 : </span> {data.reg_date}<br/>
                <span >완료여부 : </span> {data.success_check}<br/>
                <span >완료예정일 : </span>{data.success_expect_date})<br/>
                <span >완료일 : </span>{data.success_date}
              </td>
            </tr>
          </tbody>
))}
     
    </>
  );
  
}

export default TableDatas;