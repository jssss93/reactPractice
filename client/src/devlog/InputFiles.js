import React, { useEffect, useState,useRef } from 'react';

function InputFiles(props) {
  const file_cnt=props.file_cnt;
  
  // const weekArr = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const result = [];
  if(file_cnt>0){
    for (let i = 0; i < file_cnt; i++) {
      if(i==file_cnt-1){
        result.push(
          <>
          <input type='file' name={`file_${i}`} onChange={props.handleFileChange} />
          <span>add</span>
          </>
        );
      }else{
        result.push(
          <>
          <input type='file' name={`file_${i}`} onChange={props.handleFileChange} /> 
          <span>delete</span>
          <br/>
          </>
        );
      }
      
    }
  }else{
    result.push(
      <>
      <input type='file' name={`file_0`} onChange={props.handleFileChange} /> 
      <span>add</span>
      <br/>
      </>
    );
  }
  return result;
}

export default InputFiles;