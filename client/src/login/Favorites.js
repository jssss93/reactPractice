import React, {useState, useRef,useEffect} from 'react';
import FavoritesSpotData from "./FavoritesSpotData";
import FavoritesApartData from "./FavoritesApartData";

import axios from 'axios';
import $ from 'jquery';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { KAKAO_AUTH_URL } from "../assets/KakaoOAuth";
import { Link } from "react-router-dom";
import { properties } from '../include/properties';
import AutoComple_custom from './AutoComple_custom';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;



function Favorites() {

    console.log('Favorites')
    
    const [inputs, setInputs] = useState({
      MainAddrs:[],
      MidAddrs:[],
      SubAddrs:[],
      MainAddrCode:'',
      MidAddrCode:'',
      SubAddrCode:'',
      MainAddrs2:[],
      MidAddrs2:[],
      SubAddrs2:[],
      MainAddrCode2:'',
      MidAddrCode2:'',
      SubAddrCode2:'',
      datas:[],
      inputVal:''
    });
  
    const {
      MainAddrs,
      MidAddrs,
      SubAddrs,
      MainAddrCode,
      MidAddrCode,
      SubAddrCode,
      MainAddrs2,
      MidAddrs2,
      SubAddrs2,
      MainAddrCode2,
      MidAddrCode2,
      SubAddrCode2,
      datas,
      inputVal
    } = inputs;

    useEffect(() => {
      fetchMainAddr();
    }, []);



    function setInputVal(val){

      setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
        ...inputs,//객체를 복사해서
        inputVal:val //해당하는 name,value 값을 맞춰서 업데이트처리.
      });
    }
    
    const fetchMainAddr = async (e) => {
        try {
          const response = await axios.get(
            url+'/api/apart/getMainAddr'
          );
    
          setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
            ...inputs,//객체를 복사해서
            MainAddrs:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
            ,MainAddrs2:response.data
          });
          
        } catch (e) {
        }
    };


    const fetchMidAddr = async (e) => {
        var index = e.nativeEvent.target.selectedIndex;
        var selText = e.nativeEvent.target[index].text;

        if(e.target.value==='- 시도 -'){
          setInputs({
            ...inputs,
            SubAddrs2:[],
            SubAddrCode2:'',
            MidAddrs2:[],
            MidAddrCode2:'',
            MainAddrCode2:''
          });
          return false;
        }
        
        try {
          const response = await axios.post(
            url+'/api/apart/getMidAddr',
            {cate:selText}
            // {cate:$("#main_cate option:selected").text()}
          );
          setInputs({
            ...inputs,
            SubAddrs:[],
            SubAddrCode:'',
            MidAddrCode:'',
            MidAddrs:response.data,
            MainAddrCode : selText
          });
        } catch (e) {
        }
    };
    
    
    const fetchSubAddr = async (e) => {

        var index = e.nativeEvent.target.selectedIndex;
        var selText = e.nativeEvent.target[index].text;

        try {
          const response = await axios.post(
            url+'/api/apart/getSubAddr',
            {cate:selText}
          );
          setInputs({
            ...inputs,
            SubAddrCode:'',
            SubAddrs:response.data,
            MidAddrCode : selText,
            page : 1
          });
        } catch (e) {
        }
    };

    const selectSubAddr = async (e) => {

        var index = e.nativeEvent.target.selectedIndex;
        var selText = e.nativeEvent.target[index].text;

        setInputs({
          ...inputs
          ,SubAddrCode : selText
          ,page : 1
        });
    };



    
    const fetchMidAddr2 = async (e) => {
        var index = e.nativeEvent.target.selectedIndex;
        var selText = e.nativeEvent.target[index].text;
        if(e.target.value==='- 시도 -'){
          setInputs({
            ...inputs,
            SubAddrs2:[],
            SubAddrCode2:'',
            MidAddrs2:[],
            MidAddrCode2:'',
            MainAddrCode2:''
          });
          return false;
        }
        try {
          const response = await axios.post(
            url+'/api/apart/getMidAddr',
            {cate:selText}
            // {cate:$("#main_cate option:selected").text()}
          );
          setInputs({
            ...inputs,
            SubAddrs2:[],
            SubAddrCode2:'',
            MidAddrCode2:'',
            MidAddrs2:response.data,
            MainAddrCode2 : selText
          });
        } catch (e) {
        }
    };
    
    
    const fetchSubAddr2 = async (e) => {

        var index = e.nativeEvent.target.selectedIndex;
        var selText = e.nativeEvent.target[index].text;

        try {
          const response = await axios.post(
            url+'/api/apart/getSubAddr',
            {cate:selText}
          );
          setInputs({
            ...inputs,
            SubAddrCode2:'',
            SubAddrs2:response.data,
            MidAddrCode2 : selText,
            page : 1
          });
        } catch (e) {
        }
    };

    const selectSubAddr2 = async (e) => {

        var index = e.nativeEvent.target.selectedIndex;
        var selText = e.nativeEvent.target[index].text;

        setInputs({
          ...inputs
          ,SubAddrCode2 : selText
          ,page : 1
        });
    };

    async function addFavoriteApart(){
      // alert(inputVal+",,"+SubAddrCode2)
      if(inputVal===''){
        alert("아파트명을 입력해주세요")
        return false;
      }
      if(SubAddrCode2===''){
        if(window.confirm("읍면동을 선택하지 않고 등록시 정확한 조회가 어렵습니다 \n 계속하시겠습니까?")){

          

        }else{
          return false;
        }
      }
      try {
        const response = await axios.post(
          url+'/api/apart/getCount',
          {sub_cate:SubAddrCode2,keyword:inputVal}
        );

        if(response.data===0){
          alert("'"+inputVal+"'아파트명의 데이터가 존재하지않습니다.")
          return false;
        }else{
          const response2 = await axios.post(
            url+'/login/addFavoriteApart',
              {
                addr_sub_code:SubAddrCode2,
                apart_name:inputVal,
                user_id : sessionStorage.getItem('user_id')
              }
            // {cate:$("#main_cate option:selected").text()}
          );
          if(response2.data===1){
            alert("관심아파트가 등록되었습니다")
            document.location.href = '/myPage/favorites';
          }else{
              alert("error")
          }
        }

        

        console.log(response.data)
      } catch (e) {
      }
      
      
    }

    async function addFavorite(){
        if(MainAddrCode===''){
            alert("시도를 선택해주세요.")
            return false;
        }
        if(MidAddrCode===''){
            alert("시군구를 선택해주세요.")
            return false;
        }
        if(SubAddrCode===''){
            alert("읍면동을 선택해주세요.")
            return false;
        }
        // console.log(sessionStorage.getItem('user_id'))
        try {
            const response = await axios.post(
              url+'/login/addFavoriteSpot',
                {
                  MidAddrCode:MidAddrCode,
                  SubAddrCode:SubAddrCode,
                  user_id : sessionStorage.getItem('user_id')
                }
              // {cate:$("#main_cate option:selected").text()}
            );
            if(response.data===1){
                alert("관심지역이 등록되었습니다")
                document.location.href = '/myPage/favorites';
            }else{
                alert("error")
            }
            // setInputs({
            //   ...inputs,
            //   SubAddrs:[],
            //   SubAddrCode:'',
            //   MidAddrCode:'',
            //   MidAddrs:response.data,
            //   MainAddrCode : selText
            // });
          } catch (e) {
          }

        // alert(MainAddrCode+",,"+MidAddrCode+",,"+SubAddrCode)
    }

    // state = { val: '' };

    // function renderMovieTitle(state, val) {
    //     return (
    //         state.title.toLowerCase().indexOf(val.toLowerCase()) !== -1
    //     );
    // }

    

    return (
    <>
    <section id="one" className="wrapper style2">
        <div className="inner">
            <div className="box">
                <div className="image fit">
                    <img src="../images/person.jpg" alt="" />
                </div>
                <div className="content">
                    <header className="align-center">
                        <h2>관심 설정</h2>
                        <br/>
                    </header>
                    <div className='favor_main_div'>
                        <div className='favor_mid_div'>
                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    관심지역
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                                <FavoritesSpotData />
{/* {Favorites_spot_arr.map((fs,idx) => (
    <span key={fs.seq} className='span_contents'>
    {idx}순위 : {fs.addr_name}
    <a>+</a>
    <a>-</a>
    <a>*</a>
</span> 
))} */}

                                {/* <span className='span_contents'>
                                    1순위 : 영통동
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                                <span className='span_contents'>
                                    2순위 : 불당동
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                                <span className='span_contents'>
                                    3순위 : 매탄동
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span>  */}
                            </div>

                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    지역검색
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                                <span className='span_contents'>
                                    <select onChange={fetchMidAddr}>
                                        <option>- 시도 -</option>
{MainAddrs.map(MainAddr => (
                                        <option key={MainAddr.지역코드} value={MainAddr.지역코드}>{MainAddr.시도명}</option>
))}
                                    </select>
                                    <select onChange={fetchSubAddr}>
                                        <option>- 시군구 -</option>
{MidAddrs.map(MidAddr => (
                                        <option key={MidAddr.지역코드} value={MidAddr.지역코드}>{MidAddr.시군구명}</option>
))}
                                    </select>
                                    <select onChange={selectSubAddr}>
                                        <option>- 읍면동 -</option>
{SubAddrs.map(SubAddr => (
                                        <option key={SubAddr.동리명} value={SubAddr.동리명}>{SubAddr.동리명}</option>
))}
                                    </select>
                                </span> 
                            </div>
                            <div className='span_contents_btn' onClick={addFavorite}>관심등록</div>
                        </div>
                        <div className='favor_mid_div'>
                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    관심아파트
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                            <FavoritesApartData />

                                {/* <span className='span_contents_left'>
                                    1순위 : 벽적골두산
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                                <span className='span_contents_left'>
                                    2순위 : 벽적골한신
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                                <span className='span_contents_left'>
                                    3순위 : 불당아이파크
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span>  */}
                            </div>

                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    아파트검색
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                                <span className='span_contents'>
                                    <select onChange={fetchMidAddr2}>
                                        <option>- 시도 -</option>
{MainAddrs2.map(MainAddr => (
                                        <option key={MainAddr.지역코드} value={MainAddr.지역코드}>{MainAddr.시도명}</option>
))}
                                    </select>
                                    <select onChange={fetchSubAddr2}>
                                        <option>- 시군구 -</option>
{MidAddrs2.map(MidAddr => (
                                        <option key={MidAddr.지역코드} value={MidAddr.지역코드}>{MidAddr.시군구명}</option>
))}
                                    </select>
                                    <select onChange={selectSubAddr2}>
                                        <option>- 읍면동 -</option>
{SubAddrs2.map(SubAddr => (
                                        <option key={SubAddr.동리명} value={SubAddr.동리명}>{SubAddr.동리명}</option>
))}
                                    </select>
                                    <AutoComple_custom setInputVal={setInputVal} SubAddrCode2={SubAddrCode2}  />
                                        
                                    {/* <input type='text' placeholder='Search By Apartment Name'/> */}
                                </span> 
                                
                            </div>
                            <div onClick={addFavoriteApart} className='span_contents_btn'>관심등록</div>
                        </div>
                    </div>
                        
                   
                </div>
            </div>
        </div>
    </section>

    </>
    );
  
}

export default Favorites;