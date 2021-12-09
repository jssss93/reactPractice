import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { properties } from '../include/properties';

var data;
const Profile = () => {
  // alert('프로파일')
  // console.log('프로파일')
  const [user_id, setUserId] = useState();
  const [email, setEmail] = useState();
  const history = useHistory();
  // const [nickName, setNickName] = useState();
  // const [profileImage, setProfileImage] = useState();

  const getProfile = async () => { 
    // console.log('겟프로필 ')
    try {
      // Kakao SDK API를 이용해 사용자 정보 획득
      data = await window.Kakao.API.request({
        url: "/v2/user/me"
      });
      setUserId(data.id);
      setEmail(data.kakao_account.email);

      try{
        const res = await axios.post(
          properties.CALLBACK_URL_SERVER,
          {user_id:data.id,email:data.kakao_account.email}
        );
        if(res.data=='0'){
          
          sessionStorage.setItem('user_id',data.id);
          sessionStorage.setItem('email',data.kakao_account.email);
          sessionStorage.setItem('user_div','kakao');
          alert("로그인되었습니다")
          document.location.href = '/';
          // history.replace("/");
        }else if(res.data=='1'){
          await confirmJoin();

        }else{
          alert('error')
        }
      }catch(err){

      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const useConfirm = (message = null, onConfirm, onCancel) => {
    if (!onConfirm || typeof onConfirm !== "function") {
      return;
    }
    if (onCancel && typeof onCancel !== "function") {
      return;
    }
  
    const confirmAction = () => {
      if (window.confirm(message)) {
        onConfirm();
      } else {
        onCancel();
      }
    };
  
    return confirmAction;
  };
  const agreeConfirm = async() => {
    const res2 = await axios.post(
      "http://localhost:8000/login/kakaoJoin",
      {user_id:data.id,email:data.kakao_account.email}
    );
    console.log("@@@@@@@@@")
    console.log("@@@@@@@@@")
    console.log("@@@@@@@@@")
    console.log("@@@@@@@@@")
    console.log(res2)
    if(res2.data=='0'){
      sessionStorage.setItem('user_id',data.id);
      sessionStorage.setItem('email',data.kakao_account.email);
      alert("회원가입 및 로그인되었습니다");
      document.location.href = '/';
      // history.replace("/");
    }else{
      //회원가입취소
      alert('취소되었습니다.')
      history.replace("/loginView");
    }
  };
  const cancelConfirm = () => console.log("취소했습니다.");
  const confirmJoin = useConfirm(
    "회원이 존재하지 않습니다, 회원가입 하시겠습니까?",
    agreeConfirm,
    cancelConfirm
  );

  return (
    <div>
      {/* <h2>{user_id}</h2>
      <h2>{email}</h2> */}
      {/* <h2>{nickName}</h2> */}
      {/* <img src={profileImage}></img> */}
    </div>
  );
};

export default Profile;