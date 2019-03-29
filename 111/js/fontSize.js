/*
 * @Author: zl
 * @Date: 2019-03-23 15:01:44 
 * @Last Modified by: zl
 * @Last Modified time: 2019-03-23 15:03:01
 */
fnResize(); 
window.onresize = function () {
    fnResize()
}
function fnResize() {
    var deviceWidth = document.documentElement.clientWidth || window.innerWidth
    if (deviceWidth >= 750) {
    deviceWidth = 750
    }
    if (deviceWidth <= 320) {
    deviceWidth = 320
    }
    document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'
}