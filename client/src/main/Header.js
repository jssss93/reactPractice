import React from 'react';
import $ from 'jquery';

import { Link } from "react-router-dom";
import HeaderLoginArea from './HeaderLoginArea';


function Header(props) {
  const menuToggle = (e) => {
    // e.preventDefault();
    if($("#menu").attr('class') === 'visible'){
      $("#menu").attr('class','');
    }else{
      $("#menu").attr('class','visible');
    } 
  };
  const closeMenuToggle = (e) =>{
    $("#menu").attr('class','');
  }
  return (
    <>
    <header id="header" >
      <div className="logo">
      
        <Link to="/" onClick={closeMenuToggle}>
          내맘대로 <span>by CJS</span>
        </Link>
      </div>
      <a href="#menu" className="toggle" onClick={menuToggle}><span>Menu</span></a>
    </header>

    <nav id="menu" className="">
      <ul className="links">

          <li>
              <div >
                <HeaderLoginArea isLogin={props.isLogin}  menuToggle={menuToggle}/>
              </div>
          </li>
      
          <li><Link to="/" onClick={menuToggle}>Home</Link></li>
          <li><Link to="/apart" onClick={menuToggle}>Apart</Link></li>
          <li><Link to="/devLog" onClick={menuToggle}>DevLog</Link></li>
          {/* <li><a href="/api/generic.html">Generic</a></li>
          <li><a href="/api/elements.html">Elements</a></li> */}
      </ul>
      <a href="#menu" className="close" onClick={menuToggle}></a>
    </nav>
    </>
  );
  
}

export default Header;