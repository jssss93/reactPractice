import React, { useEffect, useState } from 'react';
import DatePickerComponent from './DatePickerComponent';
import $ from 'jquery';
import axios from 'axios';
import DevLogMainTable from './DevLogMainTable';
import { Link } from "react-router-dom";
function DevLogMain() {
  console.log('DevLogMain')
  const [inputs, setInputs] = useState({
    // MainAddrs:[],
    // MidAddrs:[],
    // SubAddrs:[],
    // MainAddrCode:'',
    // MidAddrCode:'',
    // SubAddrCode:'',
    startDate:new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000,
    endDate:new Date(),
    limits:[10,100,500,1000],
    limit:10,
    sortColumn:'',
    sortAlign:'',
    아파트:'',
    법정동:'',
    page:1,
    s_keyword:'',
    keyword_prm:'',
    s_cond1:'0',
    s_cond2:'1',
    s_cond_date:'1'
  });

  const {
    // MainAddrs,
    // MidAddrs,
    // SubAddrs,
    // MainAddrCode,
    // MidAddrCode,
    // SubAddrCode,
    startDate,
    endDate,
    limits,
    limit,
    // sortColumn,
    // sortAlign,
    // 아파트,
    // 법정동,
    page,
    s_keyword,
    keyword_prm,
    s_cond1,
    s_cond2,
    s_cond_date
  } = inputs;

  // const onChange = e => {
  //   setInputs({
  //       ...inputs,
  //       [e.target.name]: e.target.value
  //   });
  // };

  
  //router 사용시 useEffect 에서 async,await 문 사용 금지
  // useEffect(async() => {
  //   await fetchMainAddr();
  // }, []);
  useEffect(() => {
    // setPage();
    // fetchMainAddr();
  }, []);




  const selectSubAddr = async () => {
    setInputs({
      ...inputs
      ,SubAddrCode : $("#sub_cate option:selected").text()
      ,page : 1
    });
  };

  const selectLimit = async () => {
    setInputs({
      ...inputs
      ,limit : $("#limit option:selected").text()
      ,page : 1
    });
  };
  
  
  const setSCondDate = async (val) => {
    setInputs({
      ...inputs
      ,s_cond_date : val
      ,page : 1
    });
  };
  const setParentStartDate = async (startDate) => {
    setInputs({
      ...inputs
      ,startDate : startDate
      ,page : 1
    });
  };

  const setParentEndDate = async (endDate) => {
    setInputs({
      ...inputs
      ,endDate : endDate
      ,page : 1
    });
  };
  const setAlignColumn = async (sortAlign,sortColumn) => {
    setInputs({
      ...inputs
      ,sortAlign : sortAlign
      ,sortColumn : sortColumn
      ,page : 1
    });
  };
  
  const setPage = async (page) => {
    setInputs({
      ...inputs,
      page : page
    });
  }
    
  const selectSCond1 = async (e) => {
    setInputs({
      ...inputs,
      s_cond1 : e.target.value
    });
  }

  const selectSCond2 = async (e) => {
    setInputs({
      ...inputs,
      s_cond2 : e.target.value
    });
  }

  

  const getSearchAPIData = async () => {
    // alert(keyword_prm)
    setInputs({
      ...inputs,
      s_keyword : keyword_prm
    });
  }
  
  const keywordChange = async (e) =>{

    setInputs({
      ...inputs,
      keyword_prm :e.target.value
    });

    console.log(keyword_prm+"!!!")
  }

  const keywordPress = async(e) =>{
    if(e.key=='Enter'){
      getSearchAPIData();
    }
  }
  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      getSearchAPIData()
    }
}
// l


  return (
    <>
    	<div className="subpage">
  <input type='hidden' id='imgDown'/>
  <input type='hidden' id='href'/>
  <input type='hidden' id='dongName'/>
  <input type='hidden' id='aptName'/>
        <section id="one" className="wrapper style2">
          <div className="inner">
            <div className="box">
              <div className="image fit">

                <img className='apartImg' src="/images/memo.jpg" alt="" height="200px;" />
              </div>
              <div className="content">
                <header className="align-center">
                  <h2>개발로그</h2>
                  <br/>
                </header>
                
                <form method="post" action="#" onKeyPress={onCheckEnter}>
                  <div className='cate_div' >
                    <DatePickerComponent
                      s_cond_date={s_cond_date}
                      startDate={startDate}
                      endDate={endDate}
                      setSCondDate={setSCondDate}
                      setParentStartDate={setParentStartDate}
                      setParentEndDate={setParentEndDate}
                    />
                    <div className='datepic'>
                      <div className='datepic_el_sel'>
                        <div className='select_cjs_wrap'>
                          <select onChange={selectSCond2}>
                            <option value='1'>제목</option>
                            <option value='2'>내용</option>
                          </select>
                        </div>
                      </div>
                      <div className='input__70'>
                        <input type="text" className='keyword' name="s_keyword"  onChange={keywordChange} onKeyPress={keywordPress} placeholder="Searching By Text" />
                        <input className='display_none' type="text" name="none" id="none" placeholder="Name" />
                      </div>
                    </div>
                    <div className='datepic'>
                      <div className='datepic_el_sel_txt'>
                        <span>완료구분 : </span>
                      </div>
                      <div className='input__20'>
                        <div className='select_cjs_wrap'>
                          <select onChange={selectSCond1}>
                            <option value='0'>전체</option>
                            <option value='Y'>Y</option>
                            <option value='N'>N</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='btn_div'>
                      <ul className="actions">
                        <li className='search_btn_li' >
                          <input type="button" className='search_btn' id='search' onClick={getSearchAPIData} value="Search" />
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
                      <option key={limit} value={limit}>{limit}</option>
))}
                    </select> 
                    </div>
                    <DevLogMainTable 
                      // MidAddrCode={MidAddrCode} 
                      // SubAddrCode={SubAddrCode}
                      startDate={startDate}
                      endDate={endDate}
                      limits={limits}
                      limit={limit}
                      setAlignColumn={setAlignColumn}
                      page={page}
                      s_keyword = {s_keyword}
                      setPage={setPage}
                      s_cond_date={s_cond_date}
                      s_cond1={s_cond1}
                      s_cond2={s_cond2}
                    />
                  </div>
                </div>

                <div className='cate_div' >
                    <div className='btn_div'>
                      <ul className="actions">
                        <li className='search_btn_li' >
                          <Link to="/devLog/register" >
                          <input type="button" className='search_btn' id='search'  value="등록" />
                          </Link>
                        </li>
                      </ul>
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

export default DevLogMain;