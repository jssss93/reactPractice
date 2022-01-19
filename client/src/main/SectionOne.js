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
                <p>2022.01.19</p>
              </header>
              <hr />
              <p>1. 건물 가격 엔진 개발 완료</p>
              <p>2. 이메일서비스 오픈</p>
              <p>3. 도메인 연동(nginx)</p>
              <p>4. react cordova - 하이브리드앱 오픈</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    </>
  );
  
}

export default SectionOne;