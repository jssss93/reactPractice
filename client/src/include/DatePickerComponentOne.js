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

const DatePickerComponentOne = (props) => {
    const [Date, setDate] = useState(props.date);//초기값 6달 전
    const [endDate, setEndDate] = useState(props.endDate);

    const CustomInputDate = ({ value, onClick }) => (
        <input type='text' className='datepic_el datepicker' id='start_dt' readOnly onClick={onClick} value={value}/>
    );

    //자식state 가 바뀌면 부모 state 바뀌게,
    useEffect(() => {
        props.setDate(Date)
    }, [Date])

    
    return (
        <div className='datepic'>
            <div className='datepic_el'>
            <DatePicker
                locale={ko}
                dateFormat="yyyy.MM.dd"
                selected={Date}
                // maxDate={endDate}
                minDate={Date}
                onChange={date => setDate(date)}
                customInput={<CustomInputDate />}
            />
            </div>
        </div>
    );
};

export default DatePickerComponentOne;