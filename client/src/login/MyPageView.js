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

function MyPageView() {

    const [inputId, setInputId] = useState('')
    const [inputPw0, setInputPw0] = useState('')
    const [inputPw, setInputPw] = useState('')
    const [inputPw2, setInputPw2] = useState('')
    const [inputEmail, setInputEmail] = useState('')

    // const inputIdRef = useRef();
    const inputPw0Ref = useRef();
    const inputPwRef = useRef();
    const inputPw2Ref = useRef();
    const inputEmailRef = useRef();



    const [myPageData, setMyPageData] = useState({
        id:'',
        email:'',
        social_div:''
    });
    
    
    useEffect(()=>{
        axios.post(url+'/login/myPage',{'user_id':'cjs0533'}).then((response)=>{
            setMyPageData(response.data);
            setInputId(response.data.user_id)
            setInputEmail(response.data.email)

        })
    },[])




	// input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
    // const handleInputId = (e) => {
    //     setInputId(e.target.value)
    //     idCheckEvent(e.target.value);
    // }
    const handleInputPw0 = (e) => {
        setInputPw0(e.target.value)
        // pw0CheckEvent(e.target.value)
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
            onClickChangeInfo()
        }
    }
	// login 버튼 클릭 이벤트
    const onClickChangeInfo = async () => {
        // console.log(idCheckFlag)
        console.log(pwCheckFlag)
        console.log(pw2CheckFlag)
        console.log(emailCheckFlag)
        // if(inputId=="" || !idCheckFlag){
        //     alert("ID를 올바르게 입력해주세요")
        //     inputIdRef.current.focus();
        //     return false;
        // }

        if(inputEmail==="" || !emailCheckFlag){
            alert("이메일을 올바르게 입력해주세요")
            inputEmailRef.current.focus();
            return false;
        }
        if(inputPw0==="" ){
            alert("현재 비밀번호를 입력해주세요")
            inputPw0Ref.current.focus();
            return false;
        }

        

        //비밀번호 변경이면
        if(inputPw!=='' && inputPw2!==''){
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
        }

        const response = await axios.post(
            url+'/login/changeInfo',
            {"id" : inputId,"pw" : inputPw,"email":inputEmail,"pw0":inputPw0}
        );
        console.log(response.data)
        var rslt = response.data;

        if(rslt.state==='0'){
            alert('정보 수정 완료! \n 해당정보로 재 로그인해주세요')
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('user_email')
            sessionStorage.removeItem('user_div')
            document.location.href = '/';

        }else if(rslt.state==="99"){
            alert("현재 비밀번호가 올바르지 않습니다.");
            inputPw0Ref.current.focus();
            return false;
        }else{
            alert("에러발생");	
        }


    }

    function pwCheckEvent(pw){
        var regExpPw = /(?=.*\d{1,50})(?=.*[~`!@#$\^&*()-+=]{1,50})(?=.*[a-zA-Z]{1,50}).{10,20}$/;
        var upw = pw;
        if(!regExpPw.test(upw)){
            pwCheckFlag=false;
            $("#pwCheckIcon").hide();
            // $("#pwTitle").css('color','#a6a6a6');
            $("#pwCheckLabel").text('Password should be 10~20 digits in number and alphabetic combination.');
        }else{
            pwCheckFlag=true;
            $("#pwCheckIcon").show();
            // $("#pwTitle").css('color','green');
            $("#pwCheckLabel").text('');
        }
    }
    
    function pw2CheckEvent(pw2){
        var upw = inputPw;
        var upw2 = pw2;
        if(upw2!=upw){
            pw2CheckFlag=false;
            $("#pw2CheckIcon").hide();
            // $("#pw2Title").css('color','#a6a6a6');
            $("#pw2CheckLabel").text('Password is wrong.');
        }else{
            pw2CheckFlag=true;
            $("#pw2CheckIcon").show();
            // $("#pw2Title").css('color','green');
            $("#pw2CheckLabel").text('');
        }
    }

    async function emailCheckEvent(email){

        if(email.indexOf("@") < 0 || email.indexOf(".")<0 ){
            emailCheckFlag=false;
            $("#emailCheckIcon").hide();
            // $("#emailTitle").css('color','#a6a6a6');
            $("#emailCheckLabel").text('This is not a valid email format');
        }else{

            const response = await axios.post(
                url+'/login/emailDupleCnt',
                {"email" : email}
            );

            if(response.data=="1"){
                emailCheckFlag=false;
                $("#emailCheckIcon").hide();
                // $("#emailTitle").css('color','#a6a6a6');
                $("#emailCheckLabel").text('This E-mail is already in use');
            }else{
                emailCheckFlag=true;
                $("#emailCheckIcon").show();
                // $("#emailTitle").css('color','green');
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
                        <h2>마이페이지</h2>
                        <br/>
                    </header>
                    <form method="post" action="#" onKeyPress={onCheckEnter}>
                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'> ID : </div>
                                <div className='loginDivEl_input'>
                                    {/* <input type='text' name="id" id="id" value="" placeholder="" onkeypress="if(event.keyCode == 13) return doLogin();" /> */}
                                    <input className='keyword_readonly' type='text' name="id" id="id"  placeholder="" value={myPageData.user_id}/>
                                    {/* <FontAwesomeIcon icon={faCheck} className="chk_pass" id='idCheckIcon' /> */}
                                    {/* <i className='chk_error'   className="fas fa-check"></i> */}
                                </div>
                               
                            </div>
                            {/* <p className='chk_error' id='idCheckLabel' ></p> */}
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

                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'>* Now PW : </div>
                                <div className='loginDivEl_input'>
                                    {/* <input type="password" name="pw" id="pw" value="" placeholder="" onkeypress="if(event.keyCode == 13) return doLogin();" /> */}
                                    <input type="password" name="pw" id="pw"  placeholder=""  value={inputPw0} onChange={handleInputPw0} ref={inputPw0Ref}/>
                                    <FontAwesomeIcon icon={faCheck} className="chk_pass" id='pw0CheckIcon' />
                                    {/* <i id='pwCheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                </div>
                            </div>
                            <p className='chk_error' id='pw0CheckLabel' ></p>
                        
                        </div>

                        <div className='loginDiv'>
                            <div className='loginDivEl'>
                                <div className='loginDivEl_title'> Change PW : </div>
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
                                <div className='loginDivEl_title'> Change PW Check : </div>
                                <div className='loginDivEl_input'>
                                    <input type="password" name="pw2" id="pw2" value="" placeholder="" value={inputPw2} onChange={handleInputPw2} ref={inputPw2Ref}/>
                                    <FontAwesomeIcon icon={faCheck} className="chk_pass" id='pw2CheckIcon' />
                                    {/* <i id='pw2CheckIcon' style='color:green;display:none;' className="fas fa-check"></i> */}
                                </div>
                            </div>
                            <p className='chk_error' id='pw2CheckLabel' ></p>
                        </div>



                        {/* <div className='loginDiv' style='margin-top:50px;height:120px;'> */}
                        <div className='loginBtnDiv' >
                            <div className='loginDivEl'>
                                <ul className="actions big">
                                    <li>
                                        <div className="login_btns button alt small" onClick={onClickChangeInfo}>Change Info</div>
                                        <Link to="/myPage/favorites" >
                                        <div className="login_btns button alt small" >Favorites Page</div>
                                        </Link>
                                        <Link to="/" >
                                        <div className="login_btns button alt small" >Main Page</div>
                                        </Link>
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

export default MyPageView;