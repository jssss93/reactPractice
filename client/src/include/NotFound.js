import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope,faPhone } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
  // var now = new Date();
  return (
    <section id="one" className="wrapper style2">
      <div className="inner">
        <div>
          <div className="box">
            <div className="image fit">
              <img src="../images/pic01.jpg" alt="" />
            </div>
            <div className="content">
              <header className="align-center">
                <h2>Page Not Found.</h2>
                <p>페이지를 찾을 수 없습니다.</p>
              </header>
              <hr />
              <p>접속시간, URL</p>
              <p><FontAwesomeIcon icon={faPhone} size="lg" /> TEL : 010-6226-0533  </p>
              <p><FontAwesomeIcon icon={faEnvelope} size="lg" /> E-MAIL : choec53@gmail.com</p>
              {/* <i class="far fa-envelope"></i> */}
             
            </div>
          </div>
        </div>
      </div>
    </section>
    // <div>
    //   <h1>NotFound</h1>
    // </div>
  );
};
export default NotFound;