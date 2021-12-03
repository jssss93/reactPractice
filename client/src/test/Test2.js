import React ,{useState,useEffect}from 'react';


const Test2 = (props) => {
    alert('리렌더')
    const [startDate, setStartDate] = useState(props.startDate);//초기값 6달 전

    useEffect(() => {
        setStartDate(1111)
    }, [startDate])
    
    return (
        <>
            {props.startDate}
            <br/>
            {startDate}
        </>
    );
};

export default Test2;

//20211203
// 1. 모든 컴포넌트가 렌더링 된 후 useEffect 가 실행되어 state 값이 변경되면 이에따라 전부 리렌더링된다
// 2. 하위컴포넌트에서 한번 useState 로 초기화된 값은, 상위props가 바뀌어도 영향을 미치지 않는다
// 3. useEffect deps 는 해당컴포넌트의 state 만 영향을 미친다.
// 4. props 값과 state 값은별개,
