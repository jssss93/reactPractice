import React from "react";
import './Paging.css';
import Pagination from "react-js-pagination"; 
// const Paging = () => { 
//     const [page, setPage] = useState(1); 
//     const handlePageChange = (page) => {
//         setPage(page); 
//     }; 
//     return (
//          <Pagination 
//             activePage={page} 
//             itemsCountPerPage={10} 
//             totalItemsCount={450} 
//             pageRangeDisplayed={5} 
//             prevPageText={"‹"} 
//             nextPageText={"›"} 
//             onChange={handlePageChange} 
//         /> 
//     ); 
// }; 

// export default Paging;

const Paging = ({page, count,limit, setPage}) => { 
        // const [page, setPage] = useState(1); 
    // const handlePageChange = (page) => {
        // setPage(page); 
    // }; 
    return ( 
        <Pagination 
            activePage={page} 
            itemsCountPerPage={limit} 
            totalItemsCount={count} 
            pageRangeDisplayed={5} 
            prevPageText={"‹"} 
            nextPageText={"›"} 
            onChange={setPage} 
        /> 
    ); 
}; 
export default Paging;
