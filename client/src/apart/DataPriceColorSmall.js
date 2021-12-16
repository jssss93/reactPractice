import React  from 'react';
import common_ from '../include/common/common_js';

function DataPriceColorSmall(props) {

  if(props.price>9999999999){
    return (<span style={{color:'#D63D30'}}  >{common_.addComma(props.price)} ₩</span>);
  }else if(props.price>999999999){
    return (<span style={{color:'#eb5d0a'}}  >{common_.addComma(props.price)} ₩</span>);
  }else if(props.price>99999999){
    return (<span style={{color:'#D69F35'}}  >{common_.addComma(props.price)} ₩</span>);
  }else{
    return (<span style={{color:'green'}}  >{common_.addComma(props.price)} ₩</span>);
  }
};

export default DataPriceColorSmall;