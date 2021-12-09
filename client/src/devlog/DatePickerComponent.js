import React ,{useState,useEffect}from 'react';
import "react-datepicker/dist/react-datepicker.css"; 
import DatePicker, { registerLocale } from "react-datepicker";  // 한국어적용
import ko from 'date-fns/locale/ko'; // 한국어적용
registerLocale("ko", ko) // 한국어적용


// import { getYear, getMonth } from "date-fns"; // getYear, getMonth 
// const _ = require('lodash');//?????

//범위설정
// const years = _.range(1990, getYear(new Date()) + 1, 1); // 수정 
// const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']; 

const DatePickerComponent = (props) => {
    const [startDate, setStartDate] = useState(props.startDate);//초기값 6달 전
    const [endDate, setEndDate] = useState(props.endDate);
    const [s_cond, setSCond] = useState(props.s_cond_date);

    const CustomInputStart = ({ value, onClick }) => (
        <input type='text' className='datepic_el datepicker' id='start_dt' readOnly onClick={onClick} value={value}/>
    );
    const CustomInputEnd = ({ value, onClick }) => (
        <input type='text' className='datepic_el datepicker' id='end_dt' readOnly onClick={onClick} value={value}/>
    );

    const handleFruit = (event) => {
        // console.log(event.target.value)
        // setSCond(event.target.value);
        props.setSCondDate(event.target.value)
    };

        
    //     s_cond = e.target.value;

    //자식state 가 바뀌면 부모 state 바뀌게,
    useEffect(() => {
        props.setParentStartDate(startDate)
    }, [startDate])

    useEffect(() => {
        props.setParentEndDate(endDate)
    }, [ endDate])
    
    useEffect(() => {
        props.setSCondDate(s_cond)
    }, [ s_cond])

    return (
        <div className='datepic'>
            <div className='datepic_el_sel'>
                <select onChange={handleFruit} name='s_cond'>
                    <option value='1'>등록일</option>
                    <option value='2'>완료예정일</option>
                    <option value='3'>완료일</option>
                </select>
            </div>
            <div className='datepic_el'>
            <DatePicker
                locale={ko}
                dateFormat="yyyy.MM.dd"
                selected={startDate}
                maxDate={endDate}
                onChange={date => setStartDate(date)}
                customInput={<CustomInputStart />}
            />
            </div>
            <div className='datepic_bet'>
            ~
            </div>
            <div className='datepic_el'>
            <DatePicker
                locale={ko}
                dateFormat="yyyy.MM.dd"
                selected={endDate}
                minDate={startDate}
                maxDate={new Date()}
                onChange={date => setEndDate(date)}
                customInput={<CustomInputEnd />}
            />
            </div>
        </div>
    );
};

export default DatePickerComponent;