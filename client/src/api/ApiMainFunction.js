import React, { useEffect, useState } from 'react';
import DatePickerComponent from '../include/DatePickerComponent';
// import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import ApartMainTableFunction from './ApartMainTableFunction';


function ApiMainFunction() {

  const [inputs, setInputs] = useState({
    MainAddrs:[],
    MidAddrs:[],
    SubAddrs:[],
    MainAddrCode:'',
    MidAddrCode:'',
    SubAddrCode:'',
    startDate:new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000,
    endDate:new Date(),
    limits:[10,100,500,1000],
    limit:10,
    sortColumn:'',
    sortAlign:'',
    아파트:'',
    법정동:'',
    page:1
  });

  const {
    MainAddrs,
    MidAddrs,
    SubAddrs,
    MainAddrCode,
    MidAddrCode,
    SubAddrCode,
    startDate,
    endDate,
    limits,
    limit,
    sortColumn,
    sortAlign,
    아파트,
    법정동,
    page
  } = inputs;

  const onChange = e => {
    setInputs({
        ...inputs,
        [e.target.name]: e.target.value
    });
  };
  const fetchMainAddr = async (e) => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/apart/getMainAddr'
      );

      setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
        ...inputs,//객체를 복사해서
        MainAddrs:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
      });
      
      // dispatch({ type: 'SUCCESS',div:"main" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  };

  const fetchMidAddr = async () => {
    // dispatch({ type: 'LOADING'  });
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getMidAddr',
        {cate:$("#main_cate option:selected").text()}
      );
      setInputs({
        ...inputs,
        MidAddrs:response.data,
        MainAddrCode : $("#main_cate option:selected").text()
      });
      // dispatch({ type: 'SUCCESS',div:"mid" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  };


  const fetchSubAddr = async () => {
    // dispatch({ type: 'LOADING'  });
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getSubAddr',
        {cate:$("#mid_cate option:selected").text()}
      );
      setInputs({
        ...inputs,
        SubAddrs:response.data,
        MidAddrCode : $("#mid_cate option:selected").text()
      });
      // dispatch({ type: 'SUCCESS',div:"mid" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  };
  const selectSubAddr = async () => {
    setInputs({
      ...inputs,
      SubAddrCode : $("#sub_cate option:selected").text()
    });
  };

  const selectLimit = async () => {
    setInputs({
      ...inputs,
      limit : $("#limit option:selected").text()
    });
  };
  
  
  const setParentStartDate = async (startDate) => {
    setInputs({
      ...inputs,
      startDate : startDate
    });
  };

  const setParentEndDate = async (endDate) => {
    setInputs({
      ...inputs,
      endDate : endDate
    });
  };
  const setAlignColumn = async (sortAlign,sortColumn) => {
    setInputs({
      ...inputs,
      sortAlign : sortAlign,
      sortColumn : sortColumn
    });
  };
  
  const setPage = async (page) => {
    alert('1')
    setInputs({
      ...inputs,
      page : page
    });
  }

  useEffect(() => {
    fetchMainAddr();
  }, []);



  return (
    <>
<script src="js/chartJS.min.js"></script>
<script src="js/utils.js"></script>
    	<div className="subpage">
  <input type='hidden' id='imgDown'/>
  <input type='hidden' id='href'/>
  <input type='hidden' id='dongName'/>
  <input type='hidden' id='aptName'/>
        <section id="one" className="wrapper style2">
          <div className="inner">
            <div className="box">
              <div className="image fit">

                <img className='apartImg' src="images/apartMain.jpg" alt="" height="200px;" />
              </div>
              <div className="content">
                <header className="align-center">
                  <h2>아파트 가격 확인하기</h2>
                  <br/>
                </header>
                <form method="post" action="#">
                  <div className='cate_div' >
                    <div className='addr'>
                      <select name="main_cate" id="main_cate" onChange={fetchMidAddr}>
                        <option value="">- 시도 -</option>
                        {MainAddrs.map(MainAddr => (
                          <option key={MainAddr.지역코드} value={MainAddr.지역코드}>{MainAddr.시도명}</option>
                        ))}
                      </select>
                    </div>
                    <div className='addr'>
                      <select name="mid_cate" id="mid_cate" onChange={fetchSubAddr}>
                        <option value="">- 시군구 -</option>
                        {MidAddrs.map(MidAddr => (
                          <option key={MidAddr.지역코드} value={MidAddr.지역코드}>{MidAddr.시군구명}</option>
                        ))}
                      </select>
                    </div>
                    <div className='addr'>
                      <select name="sub_cate" id="sub_cate" onChange={selectSubAddr}> 
                        <option value="">- 동면읍 -</option>
                        {SubAddrs.map(SubAddr => (
                          <option key={SubAddr.동리명} value={SubAddr.동리명}>{SubAddr.동리명}</option>
                        ))}
                      </select>
                    </div>
                    <DatePickerComponent
                      startDate={startDate}
                      endDate={endDate}
                      // setInputs={setInputs}
                      setParentStartDate={setParentStartDate}
                      setParentEndDate={setParentEndDate}
              
                    />
                    <div className='keyword_area'>
                      {/* <input type="text" className='keyword' name="keyword" id="keyword"  placeholder="ApartMent Name" onclick='autoComplete();' onkeyup='autoComplete();' /> */}
                      <input className='display_none' type="text" name="none" id="none" placeholder="Name" />
                    </div>
                    <div className='btn_div'>
                      <ul className="actions">
                        <li className='search_btn_li' >
                          {/* <input type="button" className='search_btn' id='search' onclick='getSearchAPIData();' value="Search" /> */}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="row uniform">
                    
                    
                  </div>
                </form>
                <div id='tb_sapce'>
                  <div className="table-wrapper">
                    <input type='hidden' name='sortColumn' id='sortColumn' value='<%= sortColumn %>'/>
                    <input type='hidden' name='sortAlign' id='sortAlign' value='<%= sortAlign %>'/>

                    <hr />

                    
                    <div className='table_right' >
                    목록수 : 
                    <select className='table_limit' id = 'limit' onChange={selectLimit}>
{limits.map(limit => (
                      <option value={limit}>{limit}</option>
))}
                    </select>
                    </div>
                    <ApartMainTableFunction 
                      MidAddrCode={MidAddrCode} 
                      SubAddrCode={SubAddrCode}
                      startDate={startDate}
                      endDate={endDate}
                      limits={limits}
                      limit={limit}
                      setAlignColumn={setAlignColumn}
                      page={page}
                      setPage={setPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    
    </>
  );
  
}

export default ApiMainFunction;