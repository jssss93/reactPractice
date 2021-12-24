import React, { useState,useEffect} from 'react';
import { properties } from '../include/properties';
import axios from 'axios';  
// import { MoviesData, renderMovieTitle } from './movies-data';
import Autocomplete from 'react-autocomplete';
import './AutoStyle.css';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;



function AutoComple_apart(props) {
    const [input, setInput] = useState({val:''})
    const [datas, setDatas] = useState([]);
    useEffect(() => {
        fetchAuto();
    }, [props.SubAddrCode2,input]);

    function setInputFunc(val){
        setInput(val);
        props.setInputVal(val.val)

    }
    const fetchAuto = async (e) => {
        try {
            const response = await axios.post(
            url+'/api/apart/autoComplete',
            {sub_cate:props.SubAddrCode2,keyword:input.val}
            );
            console.log(response.data)

            setDatas(response.data)
            // setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
            // ...inputs,//객체를 복사해서
            // datas:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
            // });
            
        } catch (e) {
        }
    }

    // [
    //     {
    //         "아파트": "계룡",
    //         "법정동": "산본동"
    //     },
    //     {
    //         "아파트": "삼성미도",
    //         "법정동": "산본동"
    //     },
    //     {
    //         "아파트": "주몽마을(대림)",
    //         "법정동": "산본동"
    //     }
    // ]


    function renderApartName(input, val) {
        return (
            input.아파트.toLowerCase().indexOf(val.toLowerCase()) !== -1
        );
    }

        return (
        <div className="autocomplete-wrapper">
            <Autocomplete
            value={input.val}
            items={datas}
            getItemValue={item => item.아파트}
            shouldItemRender={renderApartName}
            renderMenu={item => (
                <div className="dropdown">
                {item}
                </div>
            )}
            renderItem={(item, isHighlighted) =>
                <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                {item.아파트}({item.법정동})
                </div>
            }
            onChange={(event, val) => setInputFunc({ val })}
            onSelect={(val,item) => setInputFunc({ val })}
            />
        </div>
        );
}
      
export default AutoComple_apart;