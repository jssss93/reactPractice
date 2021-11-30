import React from 'react';

function SectionOne(props) {
  return (
    <>
    <section id="one" className="wrapper style2">
      <div className="inner">
        <div>
          <div className="box">
            <div className="image fit">
              <img src="../images/pic01.jpg" alt="" />
            </div>
            <div className="content">
              <header className="align-center">
                <h2>Upgrade Plan</h2>
                <p>2021.03.19</p>
              </header>
              <hr />
              <p>1. 로그인,회원가입기능(카카오연동)</p>
              <p>2. 마이페이지 추가</p>
              <p>3. 하이브리드앱(Cordova) 추가</p>
              
            </div>
          </div>
        </div>
      </div>
    </section>
    
    </>
  );
  
}

export default SectionOne;