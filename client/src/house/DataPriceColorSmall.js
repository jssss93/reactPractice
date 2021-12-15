import React  from 'react';
import common_ from '../include/common/common_js';

function DataPriceColorSmall(props) {

  if(props.price>1000000000){

    return (
      <span style={{color:'#D63D30'}}  >{common_.addComma(props.price)} ₩</span>
    );
  }else if(props.price>100000000){
    return (
      <span style={{color:'#D69F35'}}  >{common_.addComma(props.price)} ₩</span>
    );
  }else{
    return (
      <span style={{color:'green'}}  >{common_.addComma(props.price)} ₩</span>
    );
  }
};

export default DataPriceColorSmall;