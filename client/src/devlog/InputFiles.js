import React, { useEffect, useState,useRef } from 'react';

function InputFiles(props) {

  
  const files2 = [
    {seq: 0}
  ];
  const [maxCnt, setMaxCnt] = useState(files2.length);
  const [files, setFiles] = useState(files2);

  function fileAdd(){
    var filesArr = files;
    filesArr.push({seq:maxCnt})
    var max = maxCnt
    setMaxCnt(++max);
    setFiles(filesArr);
  }

  const onRemove = seq => {
    // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = user.id 가 id 인 것을 제거함
    setFiles(files.filter(file => file.seq !== seq));
    props.handleFileRemove(seq);
  };

  const result = [];
  if(files.length>0){
    for (let i = 0; i < files.length; i++) {
      if(i==files.length-1){
        result.push(
          <div className='fileDiv' key={files[i].seq}>
            <input type='file' name={`file_${files[i].seq}`} onChange={props.handleFileChange} />
            <span onClick={fileAdd}>add</span>
          </div>
        );
      }else{
        result.push(
          <div className='fileDiv' key={files[i].seq}>
            <input type='file' name={`file_${files[i].seq}`} onChange={props.handleFileChange} /> 
            
            <span
              onClick={() => onRemove(files[i].seq)}  
            >remove</span>
          </div>
        );
      }
      
    }
  }else{
    result.push(
      <div className='fileDiv' key={0}>
        <input type='file' name={`file_0`} onChange={props.handleFileChange} /> 
        <span onClick={fileAdd}>add</span>
      </div>
    );
  }
  return result;
}

export default InputFiles;