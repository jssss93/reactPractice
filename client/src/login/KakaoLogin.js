import React from 'react';
import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;


const {Kakao} = window;
const loginWithKakao = () =>{
  console.log("hello");
  Kakao.Auth.authorize({
    redirectUri: 'http://localhost:3000/login/doKakaoLogin_callback'
  })
}
// FdHutvSYHR3g363Q6G6Agb_3WH4z5xb-pnXiCDnMBvhkdK8r0vel1TY7iOVZMid7qW0eqQo9dJcAAAF9js1-Mg
const KakaoLogin = () => {
  return (
    <div>
      <a id="custom-login-btn" onClick={loginWithKakao}>
        <img
          src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
          width="222"
        />
      </a>
    </div>
  );

  
};

export default KakaoLogin;