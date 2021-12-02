import React ,{useState,useEffect} from 'react';
// import './assets/css/main.css';
// import './assets/css/sub.css';
import $ from 'jquery';
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import axios from 'axios';

function ChartLine(props) {

  const [chartData, setChartData] = useState(
    {
      // labels: ["2021.06(1)건"
      // ,"2021.07(1)건"
      // , "2021.11(2)건",  'wed', 'thur', 'fri', 'sat'],
      // datasets: [{
      //   label: 'My First Dataset',
      //   data: [65, 59, 80, 81, 56, 55, 40],
      //   fill: false,
      //   borderColor: 'rgb(75, 192, 192)',
      //   tension: 0.1
      // },
      // {
      //   label: 'My Second Dataset',
      //   data: [71, 68, 63, 78, 60, 46, 61],
      //   fill: false,
      //   borderColor: 'rgb(52, 152, 219)',
      //   tension: 0.1
      // },
      // {
      //   label: 'My Third Dataset',
      //   data: [70, 70, 76, 74, 65, 50, 59],
      //   fill: false,
      //   borderColor: 'rgb(230, 126, 34)',
      //   tension: 0.1
      // }]

      labels: [],
      datasets: [{
        label: 'Loading',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]

    }

  );//초기값 6달 전



  const getDatas = async (e) => {
    console.log("차트호출")
    console.log(props.아파트+props.법정동)
    try {
      const response = await axios.post(
        'http://localhost:8000/api/apart/getChartData',
        {아파트:props.아파트,법정동:props.법정동,start_dt : $("#start_dt").val(),end_dt : $("#end_dt").val()}
      );
      var labelArr = [];
      var dataAVGArr = [];
      var dataMINArr = [];
      var dataMAXArr = [];
      var dataCNTArr = [];
      
      var data = response.data;
  
  
      // console.log(data)
      for(var i=0;i<data.length;i++){
        labelArr.push(data[i]._id.substring(0,4)+'.'+data[i]._id.substring(4,6)+"("+data[i].거래건수+")건");
        dataAVGArr.push(data[i].거래금액);
        dataMINArr.push(data[i].최소거래금액);
        dataMAXArr.push(data[i].최대거래금액);
        dataCNTArr.push(data[i].거래건수);
      }
      var chartData={
        labels:labelArr,
        datasets: [
          {
          label: '평균거래금액',
          backgroundColor: '#b71C1C',
          borderColor: '#b71C1C',
          data: dataAVGArr,
          fill: false,
          tension: 0.1
          },
          {
          label: '최소거래금액',
          backgroundColor: '#1565C0',
          borderColor: '#1565C0',
          data: dataMINArr,
          fill: false,
          tension: 0.1
          },
          {
          label: '최대거래금액',
          backgroundColor: '#FF7F50',
          borderColor: '#FF7F50',
          data: dataMAXArr,
          fill: false,
          tension: 0.1
          }
        ]
      }
      console.log(chartData)
      setChartData(chartData)

      // setInputs({ //사용자지정 setState 를 setInputs 로 위에서 지정.
      //   ...inputs,//객체를 복사해서
      //   MainAddrs:response.data //해당하는 name,value 값을 맞춰서 업데이트처리.
      // });
      
      // dispatch({ type: 'SUCCESS',div:"main" , data: response.data });
    } catch (e) {
      // dispatch({ type: 'ERROR', error: e });
    }
  };

  // async function getDatas(props) {
  //   const response = await axios.post(
  //     'http://localhost:8000/api/apart/getChartData',
  //     {아파트:props.아파트,법정동:props.법정동,start_dt : $("#start_dt").val(),end_dt : $("#end_dt").val()}
  //   );
  //   // console.log(response.data)

   

  //   // console.log(state)
  //   // return response.data;
  // }

  useEffect(() => {
    getDatas();
  }, []);
  console.log('차트 ㄱㄱ')
  return (
    <>
      <Line
      style={{  height: "100%" ,width:"100%" }}
      data={ chartData }
      options={ {
        responsive: false,
        plugins: {
          // title: {
          //   display: true,
            // text: 'Chart.js Line Chart'
          // },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            }
          },
          
          yAxes: 
          [
            {
              ticks: {
                beginAtZero: true,
                callback: function(value, index) {
                  if(value.toString().length > 0) return ((value / 100000000).toFixed(1)).toLocaleString("ko-KR") + "억";
                  // else if(value.toString().length > 4) return (Math.floor(value / 10000)).toLocaleString("ko-KR") + "만";
                  else return value.toLocaleString("ko-KR");
                }
              }
            }
          ]
            // display: true,
            // title: {
            // 	display: true,
            // 	text: 'Value'
            // }
          
        },
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                console.log(data)
                console.log(tooltipItem)
                // var value = data.datasets[0].data[tooltipItem.index];
                var value = tooltipItem.value;
                if(value.toString().length > 0) return ((value / 100000000).toFixed(1)).toLocaleString("ko-KR") + "억";
              }
          } // end callbacks:
        },
        animation: {
          // onComplete: function(animation) {
          // 	$("#href").val(myChart.toBase64Image());
          // 	$("#imgDown").val(aptName+'('+dongName+')_Chart.png');
          // 	progressing=false;
          // },
          onProgress: function(animation) {
            // $("#dongName").val(dongName);
            // $("#aptName").val(aptName);
            // $("#href").val(myChart.toBase64Image());
            // $("#imgDown").val(aptName+'('+dongName+')_Chart_userID.png');
            // progressing = true;
          },
        }
      }}
    />
    </>

  );
}

export default ChartLine;
