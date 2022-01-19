import React, {useState, useRef,useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;

function FavoritesApartData() {
    const [inputs, setInputs] = useState({
      Favorites_apart_arr:[]
    });
  
    const {
      Favorites_apart_arr
    } = inputs;

    useEffect(() => {
      fetchFavoriteSpot();
    }, []);

    const fetchFavoriteSpot = async (e) => {
        try {
          const response = await axios.post(
            url+'/login/getFavoriteApart',
            {user_id:sessionStorage.getItem('user_id')}
          );
            console.log(response.data)
          setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
            ...inputs,//객체를 복사해서
            Favorites_apart_arr:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
          });
          
        } catch (e) {
        }
    };

    async function deleteFavoriteApart(seq){
      if(window.confirm("삭제하시겠습니까?")){
        try {
          const response = await axios.post(
            url+'/login/deleteFavoriteApart',
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
            {Favorites_apart_arr.map((fs,idx) => (
                <>
                <span key={fs.seq} className='span_contents_left'>
                    {idx+1}. {fs.apart_name}({fs.addr_sub_code})
                </span> 
                <span className='span_contents_right'>
                    <a onClick={() => deleteFavoriteApart(fs.seq) }>
                    <FontAwesomeIcon color='#e07474' icon={faTrashAlt} className="search" />
                    </a>
                </span>
                </>
            ))}
        </>
    );
  
}

export default FavoritesApartData;