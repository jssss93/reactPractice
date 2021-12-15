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
                <p>2020.xx.xx</p>
              </header>
              <hr />
              <p>1. ~~~블라블라</p>
              <p>2. 블라블라~~~~</p>
              <p>3. ~~~추가연동</p>
              
            </div>
          </div>
        </div>
      </div>
    </section>
    
    </>
  );
  
}

export default SectionOne;