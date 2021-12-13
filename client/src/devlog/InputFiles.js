import React, { useEffect, useState,useRef } from 'react';

function InputFiles(props) {


  const files2 = [
    {seq: 1},
    {seq: 2},
    {seq: 3},
    {seq: 4}
  ];

  // const file_cnt=props.file_cnt;
  
  const [files, setFiles] = useState(files2);

  function fileCntUp(){
  //   var cnt=file_cnt+1
  //   setFileCnt(cnt)
  }

  const onRemove = seq => {
    // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = user.id 가 id 인 것을 제거함
    setFiles(files.filter(file => file.seq !== seq));
  };

  // function fileCntDown(){
  //   var cnt=file_cnt-1
  //   setFileCnt(cnt)
  // }
  console.log(files)
  // const weekArr = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const result = [];
  if(files.length>0){
    for (let i = 0; i < files.length; i++) {
      if(i==files.length-1){
        result.push(
          <>
          <div key={files[i].seq}>
          <input type='file' name={`file_${i}`} onChange={props.handleFileChange} />
          <span onClick={fileCntUp}>add</span>
          </div>
          </>
        );
      }else{
        result.push(
          <>
          <div key={files[i].seq}>
          <input type='file' name={`file_${i}`} onChange={props.handleFileChange} /> 
          
          <span
            onClick={() => onRemove(files[i].seq)}  
          >remove</span>
          </div>
          </>
        );
      }
      
    }
  }else{
    result.push(
      <>
      <div key={0}>
      <input type='file' name={`file_0`} onChange={props.handleFileChange} /> 
      <span onClick={fileCntUp}>add</span>
      </div>
      </>
    );
  }
  return result;
}

export default InputFiles;