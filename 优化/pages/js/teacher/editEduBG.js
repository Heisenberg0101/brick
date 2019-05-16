//事件
var editEduBG = new Vue({
    el: ".x-body",
    data: {
        graduationData: "",
        majorData: "",
    },
    methods: {
        graduationVue: function () {
            layui.use('layer', function () {
                var layer = layui.layer
                layer.prompt({
                    formType: 0,
                    value: editEduBG.graduationData,
                    title: '毕业院校',
                    area: ['400px', '200px'] //自定义文本域宽高
                }, function (value, index, elem) {
                    var idC = $(".class-div1-span1")[2]//得到value
                    idC.innerHTML = value
                    layer.close(index);
                });
            })
        },
        majorVue: function () {
            layui.use('layer', function () {
                var layer = layui.layer
                layer.prompt({
                    formType: 0,
                    value: editEduBG.majorData,
                    title: '专业',
                    area: ['400px', '200px'] //自定义文本域宽高
                }, function (value, index, elem) {
                    var idC = $(".class-div1-span1")[3]//得到value
                    idC.innerHTML = value
                    layer.close(index);
                });
            })
        },

    },
})
var addEvent = function (data) {
    var graduation = ''
    var major = ''
    for (let i = 0; i < data.length; i++) {
        if (args.id == data[i].id) {
            // $("#id-startTime").text(data[i].edustart_time);
            // $("#id-endTime").text(data[i].eduend_time);
            // $("#graduation").text(data[i].graduation);
            // $("#major").text(data[i].major);
            // $("#degree").text(data[i].degree);
            // $("#edu_remark").val(data[i].edu_remark);
            graduation = data[i].graduation
            major = data[i].major
        }
    }
    $(".x-body").on("click", function (event) {
        var target = event.target
        var classDiv1s = $(".class-div1")
        var classSpan1s = $(".class-div1-span1")
        var classSpan2s = $(".class-div1-span2")

        //学位开关
        if (target === classDiv1s[4] || target === classSpan1s[4] || target === classSpan2s[2]) {
            $(".class-degree-downBox").toggle()
        }

        // 头 勾按钮
        if (target === $(".class-top-sure")[0]) {

            //时间
            var id = args.id
            var edustart_time = $("#id-startTime").text();
            var eduend_time = $("#id-endTime").text();
            var graduation = $("#graduation").text();
            var major = $("#major").text();
            var degree = $("#degree").text();
            var edu_remark = $("#edu_remark").val();
            $.ajax({
                type: "POST",
                url: baseURL + '/saveTeacherarchives',
                data: { "id": id, 'edustart_time': edustart_time, 'eduend_time': eduend_time, 'graduation': graduation, 'major': major, 'degree': degree, 'edu_remark': edu_remark, 'type': 1 },
                success: function (data) {
                    layer.alert('保存成功！', {
                        icon: 1,
                    }, function () {
                        window.location.href = "./resume.html"
                    })
                },
                error: function (response) {
                    layer.alert('保存失败！', {
                        icon: 2,
                    })
                },
            });
        }
    })
}

//头 返回
var topReturn = function () {
    $(".class-top-return")[0].addEventListener("click", function () {
        window.location.href = "./resume.html"
    })
}
//点击弹框内容替换
var chooseDownbox = function () {
    $(".class-degree-downBox").on("click", function (event) {
        var target = event.target
        //替换
        $(".class-div1-span1")[4].innerHTML = target.innerHTML
        //隐藏
        $(".class-degree-downBox").toggle()
    })
}

//备注计数
var numCount = function () {
    var text = $("textarea")[0]
    var num = $(".class-span-count")[0]
    text.addEventListener("input", function () {
        num.innerHTML = text.value.length
    })
}
//开始时间
layui.use("laydate", function () {
    var laydate = layui.laydate
    laydate.render({
        elem: "#id-startTime"
    })
})
//结束时间
layui.use("laydate", function () {
    var laydate = layui.laydate
    laydate.render({
        elem: "#id-endTime"
    })
})
//删除
var deleteEduBG = function () {
    $(".class-btn-delete")[0].addEventListener("click", function () {
        var data = {
            "id": args.id
        }
        layer.confirm("确定删除？", function(){
            $.ajax({
                type: "POST",
                url: baseURL + '/delTeacherarchives',
                data: data,
                success: function (data) {
                    layer.alert('删除成功！', {
                        icon: 1,
                    }, function () {
                        window.location.href = "./resume.html"
                    });
                },
                error: function (response) {
                    layer.alert('失败,请重试', {
                        icon: 2,
                        fixed: false
                    })
                },
            });
        })


    })
}
//展示页面
var showData = function (data) {
    for (let i = 0; i < data.length; i++) {
        if (args.id == data[i].id) {
            $("#id-startTime").text(data[i].edustart_time);
            $("#id-endTime").text(data[i].eduend_time);
            $("#graduation").text(data[i].graduation);
            $("#major").text(data[i].major);
            $("#degree").text(data[i].degree);
            $("#edu_remark").val(data[i].edu_remark);
            $(".class-span-count")[0].innerHTML = data[i].edu_remark.length;
            editEduBG.graduationData = data[i].graduation;
            editEduBG.majorData = data[i].major;

        }
    }
}

//页面初始化
init();
function init() {
    var data = {
        "id": args.id
    }
    $.ajax({
        type: "GET",
        url: baseURL + '/getTeacherarchives',
        data: data,
        success: function (data) {
            showData(data)
            addEvent(data)
            // layer.alert('保存成功！',{
            //     icon : 1,
            // });
        },
        error: function (response) {
            layer.alert('失败,请重试', {
                icon: 2,
                fixed: false
            })
        },
    });
}

var __main = function () {
    topReturn()
    chooseDownbox()
    numCount()
    deleteEduBG()
}
__main()
