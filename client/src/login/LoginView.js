import React, {useState, useRef} from 'react';
import axios from 'axios';

import Auth from './Auth';
import { KAKAO_AUTH_URL } from "../assets/KakaoOAuth";
// import KakaoLogin from './KakaoLogin';
import { useHistory } from "react-router-dom";
import { properties } from '../include/properties';

// import $ from 'jquery';

// import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";


function LoginView() {
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    const inputIdRef = useRef();
    const inputPwRef = useRef();

	// input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
 
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }

    const onCheckEnter = (e) => {
        if(e.key === 'Enter') {
          onClickLogin()
        }
    }

    const history = useHistory();

	// login 버튼 클릭 이벤트
    const onClickLogin = async () => {
        
        if(inputId===""){
            alert("ID를 올바르게 입력해주세요")
            inputIdRef.current.focus();
            return false;
        }

        if(inputPw===""){
            alert("비밀번호를 올바르게 입력해주세요")
            inputPwRef.current.focus();
            return false;
        }

        const response = await axios.post(
            'http://localhost:8000/login/doLogin',
            {"id" : inputId,"pw" : inputPw}
        );
        console.log(response.data)

        if(response.data==="99"){
            setInputId('');
            setInputPw('');
            alert('계정이 존재하지 않습니다')

        }else if(response.data==='1'){
            alert('로그인')
            sessionStorage.setItem('user_id', inputId)//정보저장
           
            // history.replace("/");
            document.location.href = '/';

        }else if(response.data==='98'){
            alert("비밀번호가 일치하지 않습니다.")	
            setInputPw('');

        }else if(response.data==='97'){
            alert("에러발생");	
        }

    }
    // useEffect((props) => {
        
    //   }, [loginChk]);
  return (
    <>
    {/* <script defer src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
    <script>Kakao.init("35ecd6ab60c5b6517ddb7813ae9e69dc");</script> */}
    <section id="one" className="wrapper style2">
        <div className="inner">
            <div className="box">
                <div className="image fit">
                    <img src="../images/person.jpg" alt="" />
                </div>
                <div className="content">
                    <header className="align-center">
                        <h2>로그인</h2>
                        <br/>
                    </header>
                    <form method="post" action="#" onKeyPress={onCheckEnter}>
                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* ID : </div>
                                <div className='loginDivEl_input'>
                                    {/* <input type='text' name="id" id="id" value="" placeholder="" onkeypress="if(event.keyCode == 13) return doLogin();" /> */}
                                    <input type='text' name="id" id="id"  placeholder="" value={inputId} onChange={handleInputId} ref={inputIdRef}/>
                                    {/* <i id='idCheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                </div>
                            </div>
                                {/* <p id='idCheckLabel' style='color:red'></p> */}
                        {/* </div>
                        <div className='loginDiv'> */}
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* PW : </div>
                                <div className='loginDivEl_input'>
                                    {/* <input type="password" name="pw" id="pw" value="" placeholder="" onkeypress="if(event.keyCode == 13) return doLogin();" /> */}
                                    <input type="password" name="pw" id="pw"  placeholder=""  value={inputPw} onChange={handleInputPw} ref={inputPwRef}/>
                                    {/* <i id='pwCheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                </div>
                            </div>
                            {/* <p id='pwCheckLabel' style='color:red'></p> */}
                        </div>
                        {/* <div className='loginDiv' style='margin-top:50px;height:120px;'> */}
                        <div className='loginDiv' >
                            <div className='loginDivEl'>
                                <ul className="actions big">
                                    <li>
                                        {/* <a  className="login_btns button alt small" onclick='doLogin();'>Login</a>
                                        <a  className="login_btns button alt small" onclick='loginWithKakao();'>KAKAO LOGIN</a>
                                        <a  className="login_btns button alt small" onclick='openJoin();'>Join Page</a> */}

                                        {/* <KakaoLoginBtn/> */}
                                        <div href='/' className="login_btns button alt small" onClick={onClickLogin}>Login</div>
                                        {/* <h1><a href={KAKAO_AUTH_URL}>Kakao Login</a></h1> */}
                                        
                                        
                                        <div className="login_btns button alt small"  ><a className='black_anchor' href={properties.KAKAO_AUTH_URL}>KAKAO LOGIN</a></div>
                                        <div href='/' className="login_btns button alt small" >Join Page</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        




                    </form>

                </div>
            </div>
        </div>
    </section>
    </>
  );
  
}

export default LoginView;