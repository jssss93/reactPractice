import React, {useState, useRef,useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { KAKAO_AUTH_URL } from "../assets/KakaoOAuth";
import { Link } from "react-router-dom";
import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;
// import '../assets/js/kakao.js';
// import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";


// var idCheckFlag = false;
// var pw0CheckFlag = false;
var pwCheckFlag = false;
var pw2CheckFlag = false;
var emailCheckFlag = true;

function Favorites() {


 

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
                                <span className='span_contents'>
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
                                </span> 
                            </div>

                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    지역검색
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                                <span className='span_contents'>
                                    <select>
                                        <option>시도</option>
                                    </select>
                                    <select>
                                        <option>시군구</option>
                                    </select>
                                    <select>
                                        <option>읍면동</option>
                                    </select>
                                </span> 
                            </div>
                            <div className='span_contents_btn'>관심등록</div>
                        </div>
                        <div className='favor_mid_div'>
                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    관심아파트
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                                <span className='span_contents'>
                                    1순위 : 벽적골두산
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                                <span className='span_contents'>
                                    2순위 : 벽적골한신
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                                <span className='span_contents'>
                                    3순위 : 불당아이파크
                                    <a>+</a>
                                    <a>-</a>
                                    <a>*</a>
                                </span> 
                            </div>

                            <div className='favor_sub_div'>
                                <span className='span_title'>
                                    아파트검색
                                </span> 
                            </div>
                            <div className='favor_sub_div_contents_hold'>
                                <span className='span_contents'>
                                    <select>
                                        <option>시도</option>
                                    </select>
                                    <select>
                                        <option>시군구</option>
                                    </select>
                                    <select>
                                        <option>읍면동</option>
                                    </select>
                                    <input type='text' placeholder='Search By Apartment Name'/>
                                </span> 
                                
                            </div>
                            <div className='span_contents_btn'>관심등록</div>
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