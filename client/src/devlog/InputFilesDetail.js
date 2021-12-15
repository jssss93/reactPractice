import React, { useEffect, useState,useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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
  const onFilesRemove = file_seq => {
    
    var file_list = props.file_list;
    console.log(file_list)
    console.log(file_seq)
    file_list = file_list.filter(file => file.file_seq !== file_seq)
    console.log(file_list)
    props.handleBeforeFileChange(file_list);
    // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = user.id 가 id 인 것을 제거함
    // alert(file_seq)
    props.setFileList(props.file_list.filter(file => file.file_seq !== file_seq));
    //db수정 추가.
    // props.handleFileRemove(seq);
  };
  

  const result = [];
  var file_list = props.file_list;


  if(file_list.length>0){
    for (let i = 0; i < file_list.length; i++) {
      result.push(
        <div className='fileDiv' key={file_list[i].seq}>
          {/* <input type='file' name={`file_${files[i].seq}`} onChange={props.handleFileChange} />  */}
          <a onClick={() => props.filedown(file_list[i].file_seq)}>{file_list[i].org_name}</a>
          <span
            onClick={() => onFilesRemove(file_list[i].file_seq)}  
          >
            <FontAwesomeIcon style={{color: '#ad1818b3'}} icon={faTrashAlt} className="fontAwesome_custom" />
            
            {/* <i class="far fa-trash-alt"></i> */}
            
            </span>
        </div>
      );
      
    }
  }

  if(files.length>0){
    for (let i = 0; i < files.length; i++) {
      if(i==files.length-1){
        result.push(
          <div className='fileDiv' key={files[i].seq}>
            <input className='input_file' type='file' name={`file_${files[i].seq}`} onChange={props.handleFileChange} />
            <span onClick={fileAdd}>
              <FontAwesomeIcon  size='lg' style={{color: 'green'}} icon={faPlusSquare} className="fontAwesome_custom" />
            </span>
          </div>
        );
      }else{
        result.push(
          <div className='fileDiv' key={files[i].seq}>
            <input className='input_file' type='file' name={`file_${files[i].seq}`} onChange={props.handleFileChange} /> 
            
            <span
              onClick={() => onRemove(files[i].seq)}  
            >
              <FontAwesomeIcon size='lg' style={{color: '#ad1818b3'}} icon={faTrashAlt} className="fontAwesome_custom" />
            </span>
          </div>
        );
      }
      
    }
  }else{
    result.push(
      <div className='fileDiv' key={0}>
        <input className='input_file' type='file' name={`file_0`} onChange={props.handleFileChange} /> 
        <span onClick={fileAdd}>
          <FontAwesomeIcon style={{color: 'green'}} icon={faPlusSquare} className="fontAwesome_custom" />
        </span>
      </div>
    );
  }
  return result;
}

export default InputFiles;