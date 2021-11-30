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
import ApiMain from './api/ApiMain';
import { Route } from 'react-router-dom';



function App() {
  return (
    <>
    <Header color='white' cursor='none' />
      {/* <Route path="" component={Banner} exact/> */}
      {/* <Route path="/apart" component={ApiMain} /> */}
      
      
      <ApiMain />
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
