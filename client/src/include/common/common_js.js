module.exports.removeComma = function(str){
	return str.replace(/,/g, "");
};
module.exports.addComma = function(str){
	var index 		= 0;
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
        alert("숫자가아닙니다");

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
};

module.exports.getDate = function(date){
    var yyyy = date.getFullYear();
    var mm = date.getMonth()+1;
    if(mm<10){
        mm='0'+mm;
    }
    if(mm==13){
        mm='01';
    }
    if(dd<10){
        dd='0'+dd;
    }
    var dd = date.getDate();

    return yyyy+'.'+mm+'.'+dd;
}

module.exports.changeDate = function(value){
    return (value.substr(0,4)+"."+value.substr(4,2)+"."+value.substr(6,2));
}

module.exports.changeMillion = function(value){
    if(value.toString().length > 0) 
    return ((value / 100000000).toFixed(1)).toLocaleString("ko-KR") + "억";
}

module.exports.getDate = function(date){
    var yyyy = date.getFullYear();
    var mm = date.getMonth()+1;
    if(mm<10){
        mm='0'+mm;
    }
    if(mm==13){
        mm='01';
    }
    if(dd<10){
        dd='0'+dd;
    }
    var dd = date.getDate();
    
    return yyyy+'.'+mm+'.'+dd;
}

module.exports.addDotToDate = function(str){
    return str.slice(0,4) + '.' + str.slice(4, 6) + '.' + str.slice(6,8)
}
module.exports.sleep = function(ms){
    return new Promise(resolve=>{
        if(ms<0){
            ms = getRandomInt(1,5) * 1000;
        }
        console.log(ms/1000 +"초 sleep")
        setTimeout(resolve,ms)
    })
}

module.exports.getDate = function(date){
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

module.exports.calSize = function(size){
    return (size/3.3).toFixed(0);
}

module.exports.fix = function(num,i){
    return Number(num).toFixed(i);
}


function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

