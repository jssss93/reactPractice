function MM_swapImgRestore() { //v3.0
    var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
  }
  function MM_preloadImages() { //v3.0
    var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
      var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
      if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
  }
  
  function MM_findObj(n, d) { //v4.01
    var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
      d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
    if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
    for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
    if(!x && d.getElementById) x=d.getElementById(n); return x;
  }
  
  function MM_swapImage() { //v3.0
    var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
     if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
  }
  
  function goHome(){
      location.href = "/";
  }
  function move_back(){
		history.back(-1);
	}
  function goUrl(url){
      location.href= url;
  }
  function removeComma(str) {
    return str.replace(/,/g, "");
  }	
  
  function addComma(str)
  {
    var inex 		= 0;
    var result		= "";
    var	input		= "";
    var	arrInput	= new Array();
  
    if (typeof(str) == "object")
    {
      input	= String(str.value);
    }
    else
    {
      input	= String(str);
    }
  
    if (isNaN(input) == true)
    {
      // alert('숫자가아닙니다');
  
      return input;
    }
  
    arrInput = input.split(".");
    input	= String(arrInput[0]);
    index	= input.length;
    for (var i = 1; i <= index; i++)
    {
      result += input.substr(i - 1, 1);
      if (i != index && (index - i) % 3 == 0)
      {
        result += ",";
      }
    }
  
    if (arrInput.length == 2)
    {
      result	+= "." + arrInput[1];
    }
  
    if (typeof(str) == "object")
    {
      str.value	= result;
    }
    else
    {
      return	result;
    }
  }

  function getDate(date){
    var yyyy = date.getFullYear();
    var mm = date.getMonth()+1;
    var dd = date.getDate();
    if(mm<10){
      mm='0'+mm;
    }
    if(mm==13){
      mm='01';
    }
    if(dd<10){
      dd='0'+dd;
    }
    return yyyy+'.'+mm+'.'+dd
  }
  function getFullDate(pDate) {
    // pDate = new Date(pDate);
    var yyyy = pDate.getFullYear();
    var mm = pDate.getMonth() < 9 ? "0" + (pDate.getMonth() + 1) : (pDate.getMonth() + 1); // getMonth() is zero-based
    var dd  = pDate.getDate() < 10 ? "0" + pDate.getDate() : pDate.getDate();
    var hh = pDate.getHours() < 10 ? "0" + pDate.getHours() : pDate.getHours();
    var min = pDate.getMinutes() < 10 ? "0" + pDate.getMinutes() : pDate.getMinutes();
    return "".concat(yyyy).concat("-").concat(mm).concat("-").concat(dd).concat(" ").concat(hh).concat(":").concat(min);
  };
 


  function parseDate(date){
    date =new Date(date)
    return getDate(date);
    
  }

  function getTodayLabelShort(date) {
		var week = new Array('일', '월', '화', '수', '목', '금', '토');
		var today = new Date(date).getDay();
		var todayLabel = week[today];
		return todayLabel;
	}

    //날짜사이 날짜 가져오기.
    function getDatesStartToLast(startDate, lastDate) {
      if(lastDate==''){
        lastDate=startDate;
      }
      var result = [];
      var curDate = new Date(startDate);
      while(curDate <= new Date(lastDate)) {
        result.push(curDate.toISOString().split("T")[0]);
        curDate.setDate(curDate.getDate() + 1);
      }
      return result;
    }
  function getDateCnt(startDate,endDate){
    const date1 = new Date(startDate.replace(/\./gi, "-"));
    const date2 = new Date(endDate.replace(/\./gi, "-"));

    const elapsedMSec = date2.getTime() - date1.getTime(); // 172800000
    const elapsedDay = elapsedMSec / 1000 / 60 / 60 / 24; // 2
    return elapsedDay;
  }
    // function getDatesStartToLastDot(startDate, lastDate) {
    //   if(lastDate==''){
    //     lastDate=startDate;
    //   }
    //   var result = [];
    //   var curDate = new Date(startDate);
    //   while(curDate <= new Date(lastDate)) {
    //     result.push(curDate.toISOString().replace('/-/','.').split("T")[0]);
    //     curDate.setDate(curDate.getDate() + 1);
    //   }
    //   // replace(/\./gi, "-")
    //   return result;
    // }
// 이메일 검증 스크립트 작성 
  function verifyEmail(emailVal){
    // var emailVal = $("#email").val();
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
     // 검증에 사용할 정규식 변수 regExp에 저장 
    
    if (emailVal.match(regExp) == null) {
      // alert('Good!');
    // } else {
      return false;
      // alert('Error'); 
    }else{
      return true;
    }
  };
