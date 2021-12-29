import React, {useState, useRef,useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { KAKAO_AUTH_URL } from "../assets/KakaoOAuth";
import { Link } from "react-router-dom";
import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;

function FavoritesSpotData() {
    const [inputs, setInputs] = useState({
      Favorites_spot_arr:[]
    });
  
    const {
      Favorites_spot_arr
    } = inputs;

    useEffect(() => {
      fetchFavoriteSpot();
    }, []);

    const fetchFavoriteSpot = async (e) => {
        try {
          const response = await axios.post(
            url+'/login/getFavoriteSpot',
            {user_id:sessionStorage.getItem('user_id')}
          );
            console.log(response.data)
          setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
            ...inputs,//객체를 복사해서
            Favorites_spot_arr:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
          });
          
        } catch (e) {
        }
    };

    async function deleteFavoriteSpot(seq){
      if(window.confirm("삭제하시겠습니까?")){
        try {
          const response = await axios.post(
            url+'/login/deleteFavoriteSpot',
            {user_id:sessionStorage.getItem('user_id'),seq:seq}
          );
          if(response.data=='1'){
            alert("삭제되었습니다")
            document.location.href = '/myPage/favorites';
          }else{
            alert('error')
          }
            console.log(response.data)
          // setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
          //   ...inputs,//객체를 복사해서
          //   Favorites_spot_arr:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
          // });
          
        } catch (e) {
        }
      }
    }

    return (
        <>
            {Favorites_spot_arr.map((fs,idx) => (
                <>
                <span key={fs.seq} className='span_contents_left'>
                    {idx+1}순위 : {fs.addr_name}
                </span> 
                <span className='span_contents_right'>
                    <a>↑</a>
                    <a>↓</a>
                    <a onClick={() => deleteFavoriteSpot(fs.seq) }>d</a>
                </span>
                </>
            ))}
        </>
    );
  
}

export default FavoritesSpotData;