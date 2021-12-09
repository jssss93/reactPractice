import React, { useEffect, useState,useRef } from 'react';
import DatePickerComponent from '../include/DatePickerComponent';

import $ from 'jquery';
import axios from 'axios';
import DevLogMainTable from './DevLogMainTable';
import { Link } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DatePickerComponentOne from '../include/DatePickerComponentOne';

function DevLogRegister() {
  console.log('ApiMainFunction')
  const [boardContents, setBoardContents] = useState({
    title:'',
    descr:'',
    success_check:'N',
    success_expect_date:new Date(),
    reg_date:'',
    success_date:'',
    update_date:''
  });

  const titleRef = useRef();
  // const descrRef = useRef();


  const[viewContent,setViewContent] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:8000/devLog/register').then((response)=>{
      setViewContent(response.data);
    })
  },[viewContent])
  function setDate(date){
    setBoardContents({
      ...boardContents,
      success_expect_date: date
    })
  }
  const getValue = e => {
    const { name, value } = e.target;
    setBoardContents({
      ...boardContents,
      [name]: value
    })
  };

  const {
    success_expect_date
  } = boardContents;



  
  //router 사용시 useEffect 에서 async,await 문 사용 금지
  // useEffect(async() => {
  //   await fetchMainAddr();
  // }, []);
  useEffect(() => {
    // fetchMainAddr();
  }, []);




  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      // getSearchAPIData()
    }
  }

  const insertData = async () => {
    console.log(boardContents)
    if(boardContents.title===''){
      titleRef.current.focus();
      alert("제목을 입력해주세요")
      return false;
    }

    if(boardContents.descr===''){
      // CKEDITOR.instances.editor.focus();
      // descrRef.current.focus();
      alert("내용을 입력해주세요")
      return false;
    }


    alert('pass')
    // alert(boardContents.descr)
    // title: boardContents.title,
      // descr: boardContents.descr
    // axios.post('http://localhost:8000/devLog/insert', {
    //   title         : boardContents.title,
    //   descr         : boardContents.descr,
    //   success_check : boardContents.success_check,
    //   success_expect_date : boardContents.success_expect_date
    // }).then(()=>{
    //   alert('등록 완료!');
    // })

  };

// l


  return (
    <>
    	<div className="subpage">
  <input type='hidden' id='imgDown'/>
  <input type='hidden' id='href'/>
  <input type='hidden' id='dongName'/>
  <input type='hidden' id='aptName'/>
        <section id="one" className="wrapper style2">
          <div className="inner">
            <div className="box">
              <div className="image fit">

                <img className='apartImg' src="/images/devLogImg.jpg" alt="" height="200px;" />
              </div>
              <div className="content">
                <header className="align-center">
                  <h2>개발로그 등록</h2>
                  <br/>
                </header>
                <form method="post" action="#" onKeyPress={onCheckEnter}>
                  <div className='register_div' >
                    {/* <DatePickerComponent
                      startDate={startDate}
                      endDate={endDate}
                      // setInputs={setInputs}
                      setParentStartDate={setParentStartDate}
                      setParentEndDate={setParentEndDate}
                    /> */}
                    {viewContent.map(element =>
                      <div style={{ border: '1px solid #333' }}>
                        <h2>{element.title}</h2>
                        <div>
                          {ReactHtmlParser(element.descr)}
                        </div>
                      </div>
                    )}

                    

                    <div className='register_row'>
                      <div className='register_left_div' >
                        제목:
                      </div>
                      <div className='register_right_div' >
                        <input type="text" className='keyword'  onChange={getValue} name='title' placeholder="Subject" ref={titleRef} />
                      </div>
                    </div>
                    <div className='register_row'>
                      <div className='register_left_div' >
                        내용:
                      </div>
                      <div className='register_right_div_editor' >
                      <CKEditor
                        // ref={descrRef}
                        editor={ClassicEditor}
                        data="input data"
                        // onReady={editor => {
                        //   // You can store the "editor" and use when it is needed.
                        //   console.log('Editor is ready to use!', editor);
                        // }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          // console.log({ event, editor, data });
                          setBoardContents({
                            ...boardContents,
                            descr: data
                          })
                        }}
                        // onBlur={(event, editor) => {
                        //   console.log('Blur.', editor);
                        // }}
                        // onFocus={(event, editor) => {
                        //   console.log('Focus.', editor);
                        // }}
                      />
                        {/* <input type="text" className='keyword' onChange={getValue} name='descr' placeholder="Subject" /> */}
                      </div>
                    </div>
                    <div className='register_row'>
                      <div className='register_left_div' >
                        완료여부:
                      </div>
                      <div className='register_right_div_editor' >
                        <select className='input_select_10' onChange={getValue} name='success_check'>
                          <option value='N'>N</option>
                          <option value='Y'>Y</option>
                        </select>
                      </div>
                    </div>
                    <div className='register_row'>
                      <div className='register_left_div' >
                        완료예정일:
                      </div>
                      <div className='register_right_div' >
                        <DatePickerComponentOne
                          date={success_expect_date}
                          // setInputs={setInputs}
                          setDate={setDate}
                        />
                      </div>
                    </div>
                    
                    <div className='register_row'>
                      <div className='register_left_div' >
                        등록일:
                      </div>
                      <div className='register_right_div' >
                        <input type="text" className='keyword_readonly' readOnly/>
                      </div>
                    </div>
                    <div className='register_row'>
                      <div className='register_left_div' >
                        수정일:
                      </div>
                      <div className='register_right_div' >
                        <input type="text" className='keyword_readonly' readOnly />
                      </div>
                    </div>
                    <div className='register_row'>
                      <div className='register_left_div' >
                        완료일:
                      </div>
                      <div className='register_right_div' >
                        <input type="text" className='keyword_readonly' readOnly  />
                      </div>
                    </div>

                    {/* <div className='keyword_area'>
                      <input type="text" className='keyword'  placeholder="ApartMent Name" />
                      <input className='display_none' type="text" name="none" id="none" placeholder="Name" />
                    </div> */}
                    {/* <div className='btn_div'>
                      <ul className="actions">
                        <li className='search_btn_li' >
                          <input type="button" className='search_btn' id='search' onClick={getSearchAPIData} value="Search" />
                        </li>
                      </ul>
                    </div> */}
                    
                  </div>
                  <div className="row uniform">
                    
                    
                  </div>
                </form>
                <hr />
                <div className='btn_area'>
                  <div className='btn_div'>
                    <ul className="actions">
                      <li className='search_btn_li' >
                        <Link to="/devLog/register" >
                        <input type="button" className='search_btn' id='search' onClick={insertData} value="등록" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    
    </>
  );
  
}

export default DevLogRegister;