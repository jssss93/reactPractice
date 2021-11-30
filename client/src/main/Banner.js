import React from 'react';

function Banner(props) {
  return (
    <>
    <section id="banner" data-video="../images/banner">
      <div className="inner">
        <h1>내맘대로</h1>
        <p>내맘대로 만들기<br />
        built by <a href="https://templated.co/">Templated</a> and released under the <a href="https://templated.co/license">Creative Commons</a>.</p>
        <a href="#one" className="button special scrolly">Get Started</a>
      </div>
    </section>
    </>
  );
  
}

export default Banner;