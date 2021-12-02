import React, { Component,useEffect } from 'react';
import DatePickerComponent from '../include/DatePickerComponent';
import Loading from "../include/Loading";
import $ from 'jquery';
import axios from 'axios';
import ApartMainTableFunction from './ApartMainTableFunction';

//클래스를 안쓰고 함수형+Hook 로 많이 개발들 한다 더라. 2019년도부터
class ApiMain extends Component {

  constructor(props){
    super(props);
    this.max_content_id = 3;
    this.state = {
      mode:'welcome',
      MainAddrs:[],
      MidAddrs:[],
      SubAddrs:[],
      MainAddrCode:'',
      MidAddrCode:'',
      SubAddrCode:'',
      start_date:'',
      end_date:'',
      limits:[10,100,500,1000],
      apart_datas : [
        {
          // _id: new ObjectId("61a03d50d0416a6fcbb9ea06"),
          '거래금액': 137000000,
          '년': 2021,
          '월': 11,
          '일': 25,
          '법정동': '중곡동',
          '아파트': '욱현하이브Ⅲ',
          '전용면적': 15.69,
          '층': 5
        }
      ]
    }
  } 
  componentDidMount(){
    this._fetchMainAddr();
  }

  _fetchMainAddr = async() => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/apart/getMainAddr'
      );
      this.setState({
        MainAddrs : response.data
      })
      // dispatch({ type: 'SUCCESS',div:"main" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  }


  _fetchMidAddr = async () => {
    // dispatch({ type: 'LOADING'  });
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getMidAddr',
        {cate:$("#main_cate option:selected").text()}
      );
      this.setState({
        MainAddrCode:$("#main_cate option:selected").val(),
        MidAddrs : response.data})
      // dispatch({ type: 'SUCCESS',div:"mid" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  };
  _fetchSubAddr = async () => {
    // dispatch({ type: 'LOADING'  });
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getSubAddr',
        {cate:$("#mid_cate option:selected").text()}
      );
      this.setState({
        MidAddrCode:$("#mid_cate option:selected").val(),
        SubAddrs : response.data
      })
      // dispatch({ type: 'SUCCESS',div:"mid" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  };
  
  
  



  render(){
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
                        <select name="main_cate" id="main_cate" onChange={this._fetchMidAddr}>
                          <option value="">- 시도 -</option>
                          {this.state.MainAddrs.map(MainAddr => (
                            <option key={MainAddr.지역코드} value={MainAddr.지역코드}>{MainAddr.시도명}</option>
                          ))}
                        </select>
                      </div>
                      <div className='addr'>
                        <select name="mid_cate" id="mid_cate" onChange={this._fetchSubAddr}>
                          <option value="">- 시군구 -</option>
                          {this.state.MidAddrs.map(MidAddr => (
                            <option key={MidAddr.지역코드} value={MidAddr.지역코드}>{MidAddr.시군구명}</option>
                          ))}
                        </select>
                      </div>
                      <div className='addr'>
                        <select name="sub_cate" id="sub_cate">
                          <option value="">- 동면읍 -</option>
                          {this.state.SubAddrs.map(SubAddr => (
                            <option key={SubAddr.동리명} value={SubAddr.동리명}>{SubAddr.동리명}</option>
                          ))}
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
                    {/* <ApartMainTableFunction 
                      apart_datas={this.state.apart_datas} 
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      
      </>
    );
  }
}

export default ApiMain;