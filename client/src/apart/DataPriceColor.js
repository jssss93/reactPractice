import React from 'react';
import common_ from '../include/common/common_js';

function DataPriceColor(props) {

  if(props.price>1000000000){

    return (
      <div className='table_row' style={{color:'#D63D30'}}  >{common_.addComma(props.price)} ₩</div>
    );
  }else if(props.price>100000000){
    return (
      <div className='table_row' style={{color:'#D69F35'}}  >{common_.addComma(props.price)} ₩</div>
    );
  }else{
    return (
      <div className='table_row' style={{color:'green'}}  >{common_.addComma(props.price)} ₩</div>
    );
  }
};

export default DataPriceColor;