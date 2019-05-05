var log = function() {
    console.log.apply(console, arguments)
}
//返回现在日期  Separator分隔符符 格式2019sep04sep20
var show_nowTime = function(sep="-") {
    var myDate = new Date()
    var nowYear = myDate.getFullYear()
    var nowMonth =myDate.getMonth() + 1
    var nowToday = myDate.getDate()
    var nowTime = ""
    if(nowMonth <= 9) {
        nowMonth = "0" + nowMonth
    }
    if(nowToday <= 9) {
        nowToday = "0" + nowToday
    }
    nowTime = nowYear + sep + nowMonth + sep + nowToday;
    return nowTime
}
