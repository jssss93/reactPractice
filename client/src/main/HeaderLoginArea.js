import React ,{useState}from 'react';
// import $ from 'jquery';

import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";


function HeaderLoginArea(props) {

  const [inputId, setInputId] = useState(sessionStorage.getItem('user_id'))

  const onClickLogOut =  () => {
    
    sessionStorage.removeItem('user_id');
    alert('로그아웃 되었습니다');
    document.location.href = '/';
  }

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