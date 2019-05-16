var editWorked = new Vue({
    el: ".x-body",
    data: {
        workUnit: "",
    },
    methods: {
        clickWorkUnit: function() {
            layui.use('layer', function(){
                var layer = layui.layer
                    layer.prompt({
                      formType: 0,
                      value: editWorked.workUnit,
                      title: '工作单位',
                      area: ['400px', '200px'] //自定义文本域宽高
                    }, function(value, index, elem){
                        var idC =  $(".class-div1-span1")[2]//得到value
                        idC.innerHTML = value
                        layer.close(index);
                    });
            })
        },
    }
})
//开始时间
layui.use("laydate", function(){
    var laydate = layui.laydate
    laydate.render({
        elem: "#id-startTime"
    })
})
//结束时间
layui.use("laydate", function(){
    var laydate = layui.laydate
    laydate.render({
        elem: "#id-endTime"
    })
})
//添加事件
var addEvent = function() {
    $(".x-body").on("click", function(event){
        var target = event.target
        // 头 勾按钮
        if(target === $(".class-top-sure")[0]) {
                //时间'
                var id = args.id
                var strat_time = $("#id-startTime").text();
                var end_time = $("#id-endTime").text();
                var job= $("#job").text();
                var work_unit = $("#work_unit").text();
                var remark = $("#remark").val();
                var data = {
                    "id":id,
                    'strat_time':strat_time,
                    'end_time':end_time,
                    'job':job,
                    'work_unit':work_unit,
                    'remark':remark,
                    'type':2
                }

                $.ajax({
                    type: "POST",
                    url: baseURL + '/saveTeacherarchives',
                    // data:{"id":id,'strat_time':strat_time,'end_time':end_time,'job':job,'work_unit':work_unit,'remark':remark,'type':2},
                    data: data,
                    success: function (data) {
                        layer.alert('保存成功！', {
                            icon: 1,
                        },function() {
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
        //职务
        if(target === $(".class-div1")[3] || target === $(".class-div1-span2")[1] || target === $(".class-div1-span1")[3]) {
            layui.use('layer', function(){
                var layer = layui.layer
                    layer.prompt({
                      formType: 0,
                      value: '',
                      title: '职务',
                      area: ['400px', '200px'] //自定义文本域宽高
                    }, function(value, index, elem){
                        var idC =  $(".class-div1-span1")[3]//得到value
                        idC.innerHTML = value
                        layer.close(index);
                    });
            })
        }
    })
}
var topReturn = function() {
    $(".class-top-return")[0].addEventListener("click", function(){
        window.location.href = "./resume.html"
    })
}
//删除
var deleteWorked = function() {
    $(".class-btn-delete")[0].addEventListener("click", function(){
        var data  = {
            "id": args.id
        }
        layer.confirm('确定删除？', function(){
            $.ajax({
                type: "POST",
                url: baseURL + '/delTeacherarchives',
                data: data,
                success: function(data) {
                    layer.alert('删除成功！',{
                        icon : 1,
                    },function(){
                        window.location.href = "./resume.html"
                    });
                },
                error: function(response) {
                    layer.alert('失败,请重试',{
                        icon : 2,
                        fixed:false
                    })
                },
            });
        })
    })
}

var showData = function(data) {
    for(let i = 0; i < data.length; i++) {
        if(args.id == data[i].id) {
            $("#id-startTime").html(data[i].workstart_time)
            $("#id-endTime").html(data[i].workend_time)
            $("#job").html(data[i].job)
            $("#work_unit").html(data[i].work_unit)
            $("#remark").val(data[i].work_remark)
            editWorked.workUnit = data[i].work_unit
        }
    }
}

//页面初始化
init();
function init(){
    var data  = {
        "id": args.id
    }
    $.ajax({
        type: "GET",
        url: baseURL + '/getTeacherarchives',
        data: data,
        success: function(data) {
            showData(data)
            // layer.alert('保存成功！',{
            //     icon : 1,
            // });
        },
        error: function(response) {
            layer.alert('失败,请重试',{
                icon : 2,
                fixed:false
            })
        },
    });
}

//备注计数
var numCount = function() {
    var text = $("textarea")[0]
    var num = $(".class-span-count")[0]
    text.addEventListener("input", function(){
        num.innerHTML = text.value.length
    })
}
var __main = function() {
    addEvent()
    topReturn()
    numCount()
    deleteWorked()
}
__main()
