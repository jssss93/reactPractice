import React, {useState, useRef} from 'react';
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


var idCheckFlag = false;
var pwCheckFlag = false;
var pw2CheckFlag = false;
var emailCheckFlag = false;

function JoinView() {

    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    const [inputPw2, setInputPw2] = useState('')
    const [inputEmail, setInputEmail] = useState('')

    const inputIdRef = useRef();
    const inputPwRef = useRef();
    const inputPw2Ref = useRef();
    const inputEmailRef = useRef();


	// input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
    const handleInputId = (e) => {
        setInputId(e.target.value)
        idCheckEvent(e.target.value);
    }
 
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
        pwCheckEvent(e.target.value)
    }
    const handleInputPw2 = (e) => {
        setInputPw2(e.target.value)
        pw2CheckEvent(e.target.value)
    }
    const handleInputEmail = (e) => {
        setInputEmail(e.target.value)
        emailCheckEvent(e.target.value)
    }
    
    const onCheckEnter = (e) => {
        if(e.key === 'Enter') {
          onClickJoin()
        }
    }
	// login 버튼 클릭 이벤트
    const onClickJoin = async () => {
        console.log(idCheckFlag)
        console.log(pwCheckFlag)
        console.log(pw2CheckFlag)
        console.log(emailCheckFlag)
        if(inputId==="" || !idCheckFlag){
            alert("ID를 올바르게 입력해주세요")
            inputIdRef.current.focus();
            return false;
        }

        if(inputPw==="" || !pwCheckFlag){
            alert("비밀번호를 올바르게 입력해주세요")
            inputPwRef.current.focus();
            return false;
        }

        if(inputPw2==="" || !pw2CheckFlag){
            alert("비밀번호를 올바르게 입력해주세요")
            inputPw2Ref.current.focus();
            return false;
        }

        if(inputEmail==="" || !emailCheckFlag){
            alert("이메일을 올바르게 입력해주세요")
            inputEmailRef.current.focus();
            return false;
        }

        const response = await axios.post(
            url+'/login/doJoin',
            {"id" : inputId,"pw" : inputPw,"email":inputEmail}
        );
        console.log(response.data)

        if(response.data==='1'){
            alert('회원가입완료 해당정보로 로그인해주세요')
            // sessionStorage.setItem('user_id', inputId)//정보저장
            document.location.href = '/';

        }else{
            alert("에러발생");	
        }


    }

 

    async function idCheckEvent(id){
        $("#idCheckLabel").show()   
        var re = /^[a-z0-9]{6,12}$/;

        // var id = inputId;
        if(!re.test(id)){
            idCheckFlag=false;
            $("#idCheckIcon").hide();
            // $("#idTitle").css('color','#a6a6a6');
            $("#idCheckLabel").text('ID can be registered in English lowercase letters or mixed numbers between 6 and 12 characters');
        }else{
            
            const response = await axios.post(
                url+'/login/idDupleCnt',
                {"id" : id}
            );

            if(response.data > 0 ){
                idCheckFlag=false;
                $("#idCheckIcon").hide();
                // $("#idTitle").css('color','#a6a6a6');
                $("#idCheckLabel").text('Already in use');
            }else{
                idCheckFlag=true;
                $("#idCheckIcon").show();
                // $("#idTitle").css('color','green');
                $("#idCheckLabel").text('');
            }
                    
        }
       }

    function pwCheckEvent(pw){
        var regExpPw = /(?=.*\d{1,50})(?=.*[~`!@#$\^&*()-+=]{1,50})(?=.*[a-zA-Z]{1,50}).{10,20}$/;
        var upw = pw;
        if(!regExpPw.test(upw)){
            pwCheckFlag=false;
            $("#pwCheckIcon").hide();
            $("#pwTitle").css('color','#a6a6a6');
            $("#pwCheckLabel").text('Password should be 10~20 digits in number and alphabetic combination.');
        }else{
            pwCheckFlag=true;
            $("#pwCheckIcon").show();
            $("#pwTitle").css('color','green');
            $("#pwCheckLabel").text('');
        }
    }
    
    function pw2CheckEvent(pw2){
        var upw = inputPw;
        var upw2 = pw2;
        if(upw2!=upw){
            pw2CheckFlag=false;
            $("#pw2CheckIcon").hide();
            $("#pw2Title").css('color','#a6a6a6');
            $("#pw2CheckLabel").text('Password is wrong.');
        }else{
            pw2CheckFlag=true;
            $("#pw2CheckIcon").show();
            $("#pw2Title").css('color','green');
            $("#pw2CheckLabel").text('');
        }
    }

    async function emailCheckEvent(email){

        if(email.indexOf("@") < 0 || email.indexOf(".")<0 ){
            emailCheckFlag=false;
            $("#emailCheckIcon").hide();
            $("#emailTitle").css('color','#a6a6a6');
            $("#emailCheckLabel").text('This is not a valid email format');
        }else{

            const response = await axios.post(
                url+'/login/emailDupleCnt',
                {"email" : email}
            );

            if(response.data=="1"){
                emailCheckFlag=false;
                $("#emailCheckIcon").hide();
                $("#emailTitle").css('color','#a6a6a6');
                $("#emailCheckLabel").text('This E-mail is already in use');
            }else{
                emailCheckFlag=true;
                $("#emailCheckIcon").show();
                $("#emailTitle").css('color','green');
                $("#emailCheckLabel").text('');
                
            }
        }
    }

 

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
                        <h2>회원가입</h2>
                        <br/>
                    </header>
                    <form method="post" action="#" onKeyPress={onCheckEnter}>
                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* ID : </div>
                                <div className='loginDivEl_input'>
                                    {/* <input type='text' name="id" id="id" value="" placeholder="" onkeypress="if(event.keyCode == 13) return doLogin();" /> */}
                                    <input type='text' name="id" id="id"  placeholder="" value={inputId} onChange={handleInputId} ref={inputIdRef}/>
                                    <FontAwesomeIcon icon={faCheck} className="chk_pass" id='idCheckIcon' />
                                    {/* <i className='chk_error'   className="fas fa-check"></i> */}
                                </div>
                               
                            </div>
                            <p className='chk_error' id='idCheckLabel' ></p>
                        </div>
                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* PW : </div>
                                <div className='loginDivEl_input'>
                                    {/* <input type="password" name="pw" id="pw" value="" placeholder="" onkeypress="if(event.keyCode == 13) return doLogin();" /> */}
                                    <input type="password" name="pw" id="pw"  placeholder=""  value={inputPw} onChange={handleInputPw} ref={inputPwRef}/>
                                    <FontAwesomeIcon icon={faCheck} className="chk_pass" id='pwCheckIcon' />
                                    {/* <i id='pwCheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                </div>
                            </div>
                            <p className='chk_error' id='pwCheckLabel' ></p>
                        
                        </div>
                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* PW Check : </div>
                                <div className='loginDivEl_input'>
                                    <input type="password" name="pw2" id="pw2" value="" placeholder="" value={inputPw2} onChange={handleInputPw2} ref={inputPw2Ref}/>
                                    <FontAwesomeIcon icon={faCheck} className="chk_pass" id='pw2CheckIcon' />
                                    {/* <i id='pw2CheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                </div>
                            </div>
                            <p className='chk_error' id='pw2CheckLabel' ></p>
                        </div>
                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* E-mail : </div>
                                <div className='loginDivEl_input'>
                                    <input type='text' name="email" id="email" value="" placeholder="" value={inputEmail} onChange={handleInputEmail} ref={inputEmailRef}/>
                                    <FontAwesomeIcon icon={faCheck} className="chk_pass" id='emailCheckIcon' />
                                    {/* <i id='emailCheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                    
                                </div>
                            </div>
                            <p className='chk_error' id='emailCheckLabel' ></p>
                        </div>


                        {/* <div className='loginDiv' style='margin-top:50px;height:120px;'> */}
                        <div className='loginBtnDiv' >
                            <div className='loginDivEl'>
                                <ul className="actions big">
                                    <li>
                                        {/* <a  className="login_btns button alt small" onclick='doLogin();'>Login</a>
                                        <a  className="login_btns button alt small" onclick='loginWithKakao();'>KAKAO LOGIN</a>
                                        <a  className="login_btns button alt small" onclick='openJoin();'>Join Page</a> */}
                                        <div className="login_btns button alt small" onClick={onClickJoin}>JOIN</div>
                                        <div className="login_btns button alt small"  ><a className='black_anchor' href={KAKAO_AUTH_URL}>KAKAO JOIN</a></div>
                                        {/* <div href='/' className="login_btns button alt small" >KAKAO LOGIN</div> */}
                                        <Link to="/loginView" >
                                        <div className="login_btns button alt small" >LOGIN Page</div>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        


                        {/* <script type="text/javascript">
                            // SDK를 초기화 합니다. 사용할 앱의 JavaScript 키를 설정해 주세요.
                            Kakao.init('35ecd6ab60c5b6517ddb7813ae9e69dc');

                            // SDK 초기화 여부를 판단합니다.
                            console.log(Kakao.isInitialized());

                            function loginWithKakao() {
                                Kakao.Auth.login({
                                success: function(authObj) {
                                    // console.log(JSON.stringify(authObj))
                                    // console.log("-----------")	
                                    Kakao.Auth.authorize({
                                        redirectUri: 'http://localhost:3000/login/doKakaoLogin_callback'
                                    });
                                    Kakao.Auth.setAccessToken(authObj.access_token);
                                    
                                    
                                },
                                fail: function(err) {
                                    alert(JSON.stringify(err))
                                },
                                })
                            }
                            </script> */}

                    </form>

                </div>
            </div>
        </div>
    </section>
    </>
  );
  
}

export default JoinView;