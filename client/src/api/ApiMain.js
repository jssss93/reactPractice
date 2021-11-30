import React, { useEffect, useReducer } from 'react';
import DatePickerComponent from '../include/DatePickerComponent';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import ApartMainTable from './ApartMainTable';

function reducer(state, action) {
  console.log("--")
  console.log(action)
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      if(action.div=='main'){
        return {
          loading: false,
          data: action.data,
          error: null
        };
      }else if(action.div=='mid'){
        return {
          loading: false,
          midData: action.data,
          error: null
        };
      }
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function ApiMain() {

  const [state, dispatch] = useReducer(reducer, {
      loading: false,
      data: null,
      error: null,
      div:"main"
    });

  const fetchMainAddr = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.get(
        'http://localhost:8000/api/apart/getMainAddr'
      );
      console.log(response.data)
      dispatch({ type: 'SUCCESS',div:"main" , data: response.data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  const fetchMidAddr = async () => {
    dispatch({ type: 'LOADING'  });
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getMidAddr',
        {cate:$("#main_cate option:selected").text()}
      );
      console.log(response.data)
      dispatch({ type: 'SUCCESS',div:"mid" , data: response.data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };
  


  

  useEffect(() => {
    fetchMainAddr();
  }, []);

  const { loading, data: MainAddrs, error } = state; // state.data 를 MainAddrs 키워드로 조회

  if (loading) return <><Loading /></>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!MainAddrs) return null;

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
                      <select name="mid_cate" id="mid_cate">
                        <option value="">- 시군구 -</option>
                      </select>
                    </div>
                    <div className='addr'>
                      <select name="sub_cate" id="sub_cate">
                        <option value="">- 동면읍 -</option>
                      </select>
                    </div>
                    <DatePickerComponent/>
                    {/* <div className='datepic'>
                      <input type='text' className='datepic_el datepicker' id='start_dt' readOnly /> ~ 
                      <input type='text' className='datepic_el datepicker' id='end_dt' readOnly />
                    </div> */}
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
                  <ApartMainTable/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    
    </>
  );
  
}

export default ApiMain;