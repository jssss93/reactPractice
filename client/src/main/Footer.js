import React, { useState ,useRef } from 'react';
import axios from "axios";
import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;
function Footer() {

  const [inputs, setInputs] = useState({
    tel: '',
    email: '',
    message: ''
  });

  const { tel, email,message } = inputs; // 비구조화 할당을 통해 값 추출

  const telRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();
  
  const setValue = (e) =>{
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    // alert(value)
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value // name 키를 가진 값을 value 로 설정
    });
  };

  const sendMail = async (e) => {
    if(tel===""){
      alert("연락처를 입력해주세요")
      telRef.current.focus();
      return false;
    }

    if(email===""){
      alert("이메일을 입력해주세요");
      emailRef.current.focus();
      return false;
    }

    if(message===""){
      alert("내용을 입력해주세요");
      messageRef.current.focus();
      return false;
    }
    console.log(inputs)


    try {
      const response = await axios.post(
        url+'/api/sendMail2',
        {tel : tel,
        email : email,
        message : message}
      );
      alert(response.data.msg)
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }

    // $.ajax({
    //   url: "/api/sendMail2",
    //   type: "POST",
    //   cache: false,
    //   async:false,
    //   dataType: "json",
    //   data: {
    //     tel : $("#tel").val(),
    //     email : $("#email").val(),
    //     message : $("#message").val()
    //   },
    //   success: function(data){
    //     alert(data.msg)
    //   },
    //   error: function (request, status, error){
    //   var msg = "ERROR : " + request.status + "<br>"
    //   msg += + "내용 : " + request.responseText + "<br>" + error;
    //   console.log(msg);
    //   }
    // });
  };


  return (
    <>
      <footer id="footer" className="wrapper">
        <div className="inner">
          <section>
            <div className="box">
              <div className="content">
                <h2 className="align-center">Get in Touch</h2>
                <hr />
                <form action="#" method="post">
                  <div className="field half first">
                    <label >Tel</label>
                    <input name="tel" id="tel" type="text" onChange={setValue} value={tel} ref={telRef} placeholder="Tel"/>
                  </div>
                  <div className="field half">
                    <label >Email</label>
                    <input name="email" id="email" type="email" onChange={setValue} value={email} ref={emailRef} placeholder="Email"/>
                  </div>
                  <div className="field">
                    <label >Message</label>
                    <textarea name="message" id="message" rows="6" onChange={setValue} value={message} ref={messageRef} placeholder="Message"></textarea>
                  </div>
                  <ul className="actions align-center">
                    <li><input value="Send Message" className="button special" type="" onClick={sendMail} readOnly /></li>
                  </ul>
                </form>
              </div>
            </div>
          </section>
        </div>

        <div className="inner">
          <div className="copyright">
            &copy; Untitled Design: <a href="https://templated.co/">TEMPLATED</a>. Images <a href="https://unsplash.com/">Unsplash</a> Video <a href="http://coverr.co/">Coverr</a>.
          </div>
          <div className="copyright">
            &copy; Copyright : CJS , Email : choec53@gmail.com 
          </div>
        </div>
      </footer>
    </>
  );
  
}

export default Footer;