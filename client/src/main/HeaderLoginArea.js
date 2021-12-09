import React ,{useState}from 'react';
import { Link } from "react-router-dom";
import { properties } from '../include/properties';
import { Cookies } from "react-cookie"
function HeaderLoginArea(props) {

  const [inputId, setInputId] = useState(sessionStorage.getItem('user_id'))

  const onClickLogOut =  () => {
    
    sessionStorage.removeItem('user_id');
    window.Kakao.init(properties.REST_API_KEY);
    console.log(window.Kakao.Auth)
    if (window.Kakao.Auth.getAccessToken()) {
      console.log("카카오 인증 엑세스 토큰 존재", window.Kakao.Auth.getAccessToken());
      window.Kakao.Auth.logout(() => {
        console.log("카카오 로그아웃 완료", window.Kakao.Auth.getAccessToken());
      });
      confirmLogout();
      // alert('카카오 API 완전 로그아웃을 위해 카카오톡 페이지로 이동하시겠습니까?');
      // document.location.href = 'https://accounts.kakao.com';
    }else{
      // alert('로그아웃 되었습니다');
      document.location.href = '/';
      
    }
  }

  
  
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
  const agreeConfirm = () => { 
    window.open('https://accounts.kakao.com', '_blank')
    document.location.href = '/';
  };
  const cancelConfirm = () => {
    // alert('로그아웃 되었습니다');
    document.location.href = '/';
    
  }
  const confirmLogout = useConfirm(
    "카카오 API 완전 로그아웃을 위해 카카오톡 페이지로 이동하시겠습니까?",
    agreeConfirm,
    cancelConfirm
  );

  if(props.isLogin){
    return (
      <>
      <p className='p_white'>{inputId} 님 환영합니다.</p>
      <p className='p_white'>
        <Link to="/myPage" >MYPAGE</Link>
        &nbsp;/&nbsp;
        <Link to="/" onClick={props.menuToggle,onClickLogOut}>LOGOUT</Link>
      </p>
      </>
    );
  }else{
    return (
      <>
        <p className='p_white'>
          <Link to="/loginView" onClick={props.menuToggle}>LOGIN</Link>
          &nbsp;/&nbsp;
          <Link to="/joinView" onClick={props.menuToggle}>JOIN</Link>
        </p>
      </>
    );
  }
  
}

export default HeaderLoginArea;