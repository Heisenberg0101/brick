var log = function() {
    console.log.apply(console, arguments)
}
//返回现在日期  str间隔符 格式2019str04str20
var showNowTime = function(str) {
    var myDate = new Date()
    var nowYear = myDate.getFullYear()
    var nowMonth =myDate.getMonth() + 1
    for(let i = 1; i < 10; i=i+1){
        if(nowMonth == i) {
            nowMonth = "0" + nowMonth
        }
    }
    var nowToday = myDate.getDate()
    var nowTime = nowYear + str + nowMonth + str + nowToday;
    return nowTime
}
