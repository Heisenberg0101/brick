
//添加时间弹框
var titleTime = function() {
    //添加时间弹框
    layui.use("laydate", function(){
        var laydate = layui.laydate
        laydate.render({
            elem: "#id-addTitle-time"
        })
    })
}
//点击弹出弹框
var clickShowDownbox = function() {
    var classDivs = $(".class-div1")
    var classSpan2s = $(".class-div1-span2")
    $(".x-body").on("click", function(event){
        var target = event.target
        //给职称添加弹框
        if(target === classDivs[1] || target === classSpan2s[0] || target === $(".class-div1-span1")[1]) {
            $(".class-title-downBox").toggle()

        }
    })
}

//弹框内容选择
// var chooseDownbox = function() {
//     //职称 选择
//     $(".class-title-downBox").on("click", function(event){
//         var target = event.target
//         //替换
//         $(".class-div1-span1")[1].innerHTML = target.innerHTML
//         //隐藏
//         $(".class-title-downBox").toggle()
//     })
// }
var title = new Vue({
    el: ".x-body",
    data: {
        title: "",
        jobTitle: ["正高级教师", "高级教师", "一级教师", "二级教师", "三级教师", "未定级教师"],
        jobTitleLevel: [],
    },
    methods: {
        chooseTitle: function(type) {
            $(".class-title-downBox").toggle()
            this.title = type
            if(type == "正高级教师") {
                this.jobTitleLevel = ["一级", "二级","三级","四级"]
            }
            if(type == "高级教师") {
                this.jobTitleLevel = ["五级", "六级","七级"]
            }
            if(type == "一级教师") {
                this.jobTitleLevel = ["八级", "九级","十级"]
            }
            if(type == "二级教师") {
                this.jobTitleLevel = ["十一级", "十二级"]
            }
            if(type == "三级教师") {
                this.jobTitleLevel = ["十三级"]
            }
            if(type == "未定级教师") {
                this.jobTitleLevel = ["未定级"]
            }
            $(".class-title-downBoxLevel").toggle()
        },
        chooseTitleLevel: function(type) {
            this.title += type
            $(".class-div1-span1")[1].innerHTML = this.title
            $(".class-title-downBoxLevel").toggle()
        }
    }
})
//头 勾
var topSure = function() {
    $(".class-top-sure")[0].addEventListener("click", function(){
        var classSpan1s = $(".class-div1-span1")
        var technicalTime = classSpan1s[0].innerHTML
        var technical = classSpan1s[1].innerHTML
        var data = {
            "id": args.index,
            "technical_time":  technicalTime,
            "technical": technical,
        }
        // console.log(data)
        $.ajax({
            type: "POST",
            url: baseURL + '/saveTeachertitle',
            data: data,
            success: function (data) {
                // information.info = data;
                // console.log(data);
                layer.alert('保存成功', {
                    icon: 1,
                },function(){
                    window.location.href = "./title.html"
                })
            },
            error: function (response) {
                layer.alert('信息表加载失败，请重试', {
                    icon: 2,
                })
            },
        });
    })
}

//头 返回
var topReturn = function() {
    $(".class-top-return")[0].addEventListener("click", function(){
        window.location.href = "./title.html"
    })
}

//删除项目
var deleteTitle = function() {
    $(".class-btn-delete")[0].addEventListener("click", function(){
        var data  = {
            "id": args.index
        }
        layer.confirm('确定删除？', function(){
            $.ajax({
                type: "GET",
                url: baseURL + '/delTeachertitle',
                data: data,
                success: function(data) {
                    layer.alert('删除成功！',{
                        icon : 1,
                    },function(){
                        window.location.href = "./title.html"
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

// 页面初始化
init();
function init(){
    var data = args.index
    $.ajax({
        type: "GET",
        url: baseURL + '/getTeachertitle',
        data: data,
        success: function(data) {

            // console.log(data);

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

//修改
var changeEdittitle = function() {
    // console.log("hello")
    $(".class-div1-span1")[0].innerHTML = args.time
    $(".class-div1-span1")[1].innerHTML = args.name
}

var __main = function() {
    titleTime()
    clickShowDownbox()
    // chooseDownbox()
    topReturn()
    topSure()
    deleteTitle()
    changeEdittitle()
}
__main()

// alert(args.time);
// alert(args.name);
