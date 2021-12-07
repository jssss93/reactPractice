import React from 'react';
import '../loading.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
function Loading() {
  return (
    <>
        <div className="loading_bx" >
            <div className="loading">
                {/* <div className="loadingio-spinner-dual-ring-9cvfyzm989d">
                    <div className="ldio-ow7acjar329">
                    
                    </div>
                </div> */}
                <FontAwesomeIcon icon={faSpinner} spin size="4x" />
                <span>Loading. . .</span>
            </div>
        </div>
    </>
  );
  
}

export default Loading;