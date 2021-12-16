import React ,{useState} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import common_ from '../include/common/common_js';
import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;
function TableDatas(props) {
  const [datas, setDatas] = useState(props.datas);
 
  const ssucess_update = async(seq) => {
    if (window.confirm("완료처리하시겠습니까?")) {
      try {
        const response = await axios.post(url+'/devLog/success_update',{seq:seq});
        console.log(response.data)
        if(response.data===1){
          alert("완료 처리 되었습니다.")
          document.location.href='/devLog';
        }else{
          alert("error")
        }
        
      } catch (e) {

      }
    }

  };


  return (
    <>
{

datas.map(data => (
          <tbody key={data._id} id={data._id}  >
            <tr  className='table_basic'>
              <td><Link to={`/devLog/detail/${data.seq}`} >{data.title}</Link> </td>
              <td>{common_.getParseDate(data.reg_date)}</td>
              <td>{data.success_check}</td>
              <td>{common_.getParseDate(data.success_expect_date)}</td>
              <td>
                  {
                    data.success_check === 'Y' 
                    ? common_.getParseDateHHMMSS(data.success_date)
                    : <span 
                        onClick={() => ssucess_update(data.seq)}  
                        className='table_inner_btn'
                      >완료처리</span>
                  }
              </td>
            </tr>
            {/* ssucess_update(this,'<%=data.seq%>'); */}
            <tr className='table_small' >
              <td className='table_samll_td' colSpan={5} >
                <span >제목 : </span> <Link to={`/devLog/detail/${data.seq}`} >{data.title}</Link><br/> 
                <span >등록일 : </span> {common_.getParseDate(data.reg_date)}<br/>
                <span >완료여부 : </span> {data.success_check}<br/>
                <span >완료예정일 : </span>{common_.getParseDate(data.success_expect_date)}<br/>
                <span >완료일 : </span>
                {
                    data.success_check === 'Y' 
                    ? common_.getParseDateHHMMSS(data.success_date)
                    : <span 
                        onClick={() => ssucess_update(data.seq)}  
                        className='table_inner_btn'
                      >완료처리</span>
                  }
              </td>
            </tr>
          </tbody>
))}
     
    </>
  );
  
}

export default TableDatas;