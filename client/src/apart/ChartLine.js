import React  from 'react';
import $ from 'jquery';
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto' //챠트에 꼭 필요
// import { Chart }            from 'react-chartjs-2' 
import axios from 'axios';
import useAsyncChart from '../useAsyncChart';
import Loading from '../include/Loading';

import { properties } from '../include/properties';
var url = properties.SERVER_DOMAIN+":"+properties.RSERVER_PORT;

const getDatas = async (props) => {
  try {
    const response = await axios.post(
      url+'/api/apart/getChartData',
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
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        data: dataAVGArr,
        fill: false,
        tension: 0.1
        },
        {
        label: '최소거래금액',
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        data: dataMINArr,
        fill: false,
        tension: 0.1
        },
        {
        label: '최대거래금액',
        backgroundColor: '#FF9F40',
        borderColor: '#FF9F40',
        data: dataMAXArr,
        fill: false,
        tension: 0.1
        }
      ]
    }
    console.log(chartData)
    return chartData;
  } catch (e) {
    // dispatch({ type: 'ERROR', error: e });
  }
};

function ChartLine(props) {
  const [state, refetch] = useAsyncChart(props,getDatas, 
    [
      props.chartFlag
    ]
  );

  const { loading, data: chartData, error } = state; // state.data 를 datas 키워드로 조회
  if (loading) return <><Loading /></>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!chartData) return null;
  
  if(chartData.labels.length===0){
    return <></>
  }else{
    console.log('차트 ㄱㄱ')
    console.log(chartData)
  return (
    <>
    <tr className='myChart_tr' >
      <td colSpan={5}  >
        <span className='myChart_email' >
          {/* <a  onClick="sendDataEmail('<%=idx%>');">send E-Mail</a> */}
          <a>send E-Mail</a>
        </span>
        <span className='myChart_div'  >
          <Line
          style={{ height: "100%" ,width:"100%" }}
          data={ chartData }
          options={ {
            responsive: true,
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
                  // text: 'Value'
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
      </span>
    </td>
  </tr>
  </>

  );
    }
}

export default ChartLine;
