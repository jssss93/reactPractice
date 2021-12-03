import React ,{useState,useEffect}from 'react';
import Test2 from './Test2';

var cnt=0;
const Test1 = (props) => {
    const [startDate, setStartDate] = useState(1);
    const [endDate, setEndDate] = useState(2);

    
    useEffect(() => {
        alert('부모useEffeect ')
        // setStartDate(12345)
        // props.setParentEndDate(endDate)
    }, [])
    function change(){
        setStartDate(2345)
    }
    
    function changeParent(){
        setStartDate('parent'+cnt++)
    }
    
    return (
        <>
            <Test2 startDate={startDate} setStartDate={setStartDate}></Test2>
            <br/>
            <button onClick={changeParent}>changeParent</button>
            <button onClick={change}>changeChild</button>
        </>
    );
};

export default Test1;

