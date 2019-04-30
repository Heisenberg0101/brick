var find = function(s1, s2) {
    /*
    s1 s2 都是 string
    但 s2 的长度是 1

    返回 s2 在 s1 中的下标, 从 0 开始, 如果不存在则返回 -1
    */
    var index = -1
    for(let i = 0; i < s1.length; i++) {
        if(s2 === s1[i]) {
            index = i
        }
    }
    return index
}
// 这里是两个字符串, 包含了大写字母和小写字母
var lower = 'abcdefghijklmnopqrstuvwxyz'
var upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var lowercase = function(s) {
    // 假设字符串s都是大写字母 返回s小写
    var result = ""
    for(let i = 0; i < s.length; i++){
        var index = find(upper, s[i])
        result += lower[index]
    }
    return result
}
var uppercase = function(s) {
    // 假设字符串s 都是小写字母 返回s大写
    var result = ""
    for(let i = 0; i < s.length; i++){
        var index = find(lower, s[i])
        result += upper[index]
    }
    return result
}
var lowercase1 = function(s) {
    //将字符串s中大写字母改成小写字母
    var result = ""
    for(let i = 0; i < s.length; i++){
        var index = find(upper, s[i])
        if(index = -1) {
            result += s[i]
        }
        if(index > -1) {
            result += lower[i]
        }
    }
    return result
}
var uppercase1 = function(s) {
    var result = ""
    for(let i = 0; i < s.length; i++){
        if(index = -1) {
            result += s[i]
        }else if(index > -1) {
            result += upper[i]
        }
    }
    return result
}
//s是偏移的字母 n是偏移位数
var shiftedChar = function(s, n) {
    var lower = 'abcdefghijklmnopqrstuvwxyz'
    var upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var index = find(lower, s)
    if(index === -1) {
        index = find(upper, s)
        if(index === -1) {
            return s
        }
        index += n
        s = upper[index % 26]
        return s
    }else if(index > -1) {
        index += n
        s = lower[index % 26]
        return s
    }
}
//凯撒加密 右移1位
var encode1 = function(s) {
    var result = ""
    for(let i = 0; i < s.length; i++){
        //对每一个字母进行右移
        result += shiftedChar(s[i],1)
    }
    return result
}
//凯撒解密 右移一位 解密
var decode1 = function(char) {
    var result = ""
    for(let i = 0; i < char.length; i++){
        var s = char[i]
        result += shiftedChar(s, -1)
    }
    return result
}
//加一个参数 表示右移位数
var encodeN = function(char, n) {
    var result = ''
    for(let i = 0; i < s.length; i++){
        result += shiftedChar(s[i], n)
    }
    return result
}
//凯撒解密 多一个参数 表示左移位数
var decodeN = function(char, n) {
    var result = ""
    for(let i = 0; i < char.length; i++){
        var s = char[i]
        result += shiftedChar(s, n)
    }
}
