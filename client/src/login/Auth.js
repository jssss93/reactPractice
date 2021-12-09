import React from "react";
import { useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useHistory } from "react-router-dom";
import { properties } from '../include/properties';


const Auth = () => {
      
  const REST_API_KEY = properties.REST_API_KEY;
  const REDIRECT_URI = properties.REDIRECT_URI;
  const CLIENT_SECRET = properties.CLIENT_SECRET;

  // calllback으로 받은 인가코드
  const code = new URL(window.location.href).searchParams.get("code");
  // console.log(code)
// alert(code)
  const history = useHistory();

  const getToken = async () => {
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
      client_secret: CLIENT_SECRET,
    });
    try {
      // access token 가져오기
      const res = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        payload
      );
      // Kakao Javascript SDK 초기화
      window.Kakao.init(REST_API_KEY);
      // access token 설정
      window.Kakao.Auth.setAccessToken(res.data.access_token);
      history.replace("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getToken();
  });

  return (
    <div>
        { code }
    </div>
  );
};

export default Auth;