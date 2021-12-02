import React from 'react';
import './assets/css/main.css';
import './assets/css/sub.css';
import Header from './main/Header';
import Banner from './main/Banner';

// import SectionOne from './main/SectionOne';
// import SectionTwo from './main/SectionTwo';
// import SectionThree from './main/SectionThree';
// import SectionFour from './main/SectionFour';

import Footer from './main/Footer';
import ApiMainClass from './api/ApiMainClass';
import ApiMainFunction from './api/ApiMainFunction';
import { Route } from 'react-router-dom';
import Users from './Users';



function App() {
  return (
    <>
    <Header color='white' cursor='none' />
      {/* <Route path="" component={Banner} exact/> */}
      {/* <Route path="/apart" component={ApiMain} /> */}
      {/* <Users/> */}
      <ApiMainFunction/>
      
      {/* <ApiMainClass /> */}
      {/* <Banner /> 
      
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour /> */}

      <Footer />
    </>

  );
}

export default App;
