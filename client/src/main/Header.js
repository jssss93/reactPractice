import React from 'react';
import $ from 'jquery';
function Header(props) {
  const menuToggle = (e) => {
    e.preventDefault();
    if($("#menu").attr('class') === 'visible'){
      $("#menu").attr('class','');
    }else{
      $("#menu").attr('class','visible');
    } 
  };

  return (
    <>
    <header id="header" >
      <div className="logo">
        <a href="/api/main">내맘대로 <span>by CJS</span></a>
      </div>
      <a href="#menu" className="toggle" onClick={menuToggle}><span>Menu</span></a>
    </header>

    <nav id="menu" className="">
      <ul className="links">
          <li>
              <div >
                  <a style={{color:props.color}} href="/login/loginView">LOGIN</a>&nbsp;&nbsp;&nbsp;
                  <a style={{cursor:props.cursor}} href="/login/loginView"  > /</a>&nbsp;&nbsp;&nbsp;
                  <a style={{color:props.color}} href="/login/joinView">JOIN</a>
              </div>
          </li>
          <li><a href="/api/index.html">Home</a></li>
          <li><a href="/api/generic.html">Generic</a></li>
          <li><a href="/api/elements.html">Elements</a></li>
      </ul>
      <a href="#menu" className="close" onClick={menuToggle}></a>
    </nav>
    </>
  );
  
}

export default Header;