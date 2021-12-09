import React, { useEffect, useState } from 'react';
import {  Route, Switch, BrowserRouter as Router } from "react-router-dom";

import './assets/css/main.css';
import './assets/css/sub.css';

import Header from './main/Header';
import Footer from './main/Footer';
// import ApiMainClass from './apart/ApiMainClass';
import ApiMainFunction from './apart/ApiMainFunction';
import LoginView from './login/LoginView';
import JoinView from './login/JoinView';
import NotFound from "./include/NotFound";
import Home from "./Home";
import Auth from './login/Auth';
import Profile from './login/Profile';
import DevLog from './devlog/DevLogMain';
import DevLogRegister from './devlog/DevLogRegister';
import DevLogDetail from './devlog/DevLogDetail';
function App() {

  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    if(sessionStorage.getItem('user_id') === null){
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
      // console.log('isLogin ?? :: ', isLogin)
    } else {
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
    // 로그인 상태 변경
      setIsLogin(true)
      // console.log('isLogin ?? :: ', isLogin)
    }
  })


  return (
    <Router >
      {/* Links */}
      <Header isLogin={isLogin} color='white' cursor='none' />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/apart" component={ApiMainFunction} />
          <Route path="/loginView" component={LoginView} />
          <Route path="/joinView" component={JoinView} />
          <Route path="/loginView" component={LoginView} />
          <Route path="/profile" component={Profile } />
          <Route exact path="/devLog" component={DevLog } />
          <Route path="/devLog/register" component={DevLogRegister } />
          <Route path="/devLog/detail" component={DevLogDetail} />
          <Route path="/login/doKakaoLogin_callback">
            <Auth />
          </Route> 

          <Route component={NotFound} />
          
           

        </Switch>
      </main>  
      <Footer />
    </Router>

  );
}

export default App;
