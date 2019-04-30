var log = function() {
    console.log.apply(console, arguments)
}
var zfill = function(n, width) {
    /*
        n 是 int 类型
        width 是 int 类型

        把 n 的位数变成 width 这么长，并在右对齐，不足部分用 0 补足并返回
        具体请看测试, 注意, 返回的是 string 类型

        返回 string 类型
        */
    var str = String(n)
    for(let i = str.length; i < width; i++){
        str = "0" + str
    }
    return str
}
var ljust = function(s, width, fillchar=' ') {
    /*
        s 是 string
        width 是 int
        fillchar 是 长度为 1 的字符串, 默认为空格 ' '

        如果 s 长度小于 width, 则在末尾用 fillchar 填充并返回
        否则, 原样返回, 不做额外处理

        返回 string 类型
        */
    var result = s
    if(s.length >= width) {
        return result
    }
    for(let i = s.length; i < width; i++){
        result += fillchar
    }
    return result
}
var rjust = function(s, width, fillchar=' ') {
    /*
    s 是 string
    width 是 int
    fillchar 是 长度为 1 的字符串, 默认为空格 ' '

    如果 s 长度小于 width, 则在开头用 fillchar 填充并返回

    返回 string 类型
    */
    var result = s
    if(s.length >= width) {
        return result
    }
    for(let i = s.length; i < width; i++){
        result = fillchar + result
    }
    return result
}
var center = function(s, width, fillchar=' ') {
    /*
    s 是 string
    width 是 int
    fillchar 是 长度为 1 的字符串, 默认为空格 ' '

    如果 s 长度小于 width, 则在两边用 fillchar 填充并返回
    如果 s.length 和 width 互为奇偶, 则无法平均分配两边的 fillchar
    这种情况下, 让左边的 fillchar 数量小于右边

    返回 string 类型
    */
    var result = s
    var sLen = s.length
    if(sLen < width) {
        var rightLen = Math.ceil((width - sLen) / 2)
        var leftLen = Math.floor((width - sLen) / 2)
        var leftResult = rjust("", rightLen, fillchar)
        var rightResult = ljust("", leftLen, fillchar)
        result = leftResult + result + rightResult
        return result
    }else if (sLen >= width) {
        return result
    }
}
var is_space = function(s) {
    /*
    s 是 string
    检查 s 中是否只包含空格

    返回 bool, 如果 s 中包含的只有空格则返回 true, 否则返回 false
    */
    var bool = true
    for(let i = 0; i < s.length; i++){
        var str = s[i]
        if(!str.includes(" ")) {
            return false
        }
    }
    return bool
}
var is_num = function(s) {
    /*
    s 是字符串
    检查 s 中是否只包含数字
    返回: bool, 如果 s 中包含的只有数字则返回 true, 否则返回 false
    */
    
}
