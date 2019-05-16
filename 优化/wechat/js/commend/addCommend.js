var img = '';
Vue.component('item', {
    props: ['gradeid', 'gradename'],
    template: '<li><input @click="delName" name="gradeid" type="checkbox" :value="gradeid">{{this.gradename}}<span @click="chooseClass" class="li_span"><img src="../image/right-arrow.png"></span></li>',
    methods: {
        chooseClass: function() {
            var range = $("input[name='range']:checked").val(); //表彰类型
            var content = $("#content").val(); //表彰内容
            window.location.href = './studenName.html?ID=' + this.gradeid + '&u=' + args.u + '&range=' + range + '&img=' + img + '&content=' + content;
        },
        delName: function() {
            $("#student").html('');
        }
    }
})
var width = $('body').width();
var wid = width + 'px';
$('.box-2').css({
    left: wid
});

var index = new Vue({
    el: ".box",
    data: {
        grade: [],
        content: '',
        content1: '',
        img: '',
        open: 0,
        detail:''
    },
    methods: {
        down: function(e) {
            $(e.target).next().css('display') == 'block' ? $(e.target).next().css('display', 'none') : $(e.target).next().css('display', 'block');
        },
        bigScreen: function(e) {
            index.img = $(e.target).attr('src');
            img = index.img;
            $('.imgBox').css('border-color', '#e6e6e6');
            $(e.target).parent().css('border-color', 'red');
        },
        showTo: function() {
            $('.box-1').animate({
                left: (-width) + 'px'
            });
            $('.box-2').animate({
                left: 0
            });
            $('.operate').css({
                display: 'none'
            });
            $('.slide-btn').css({
                display: 'block'
            });
        },
        toggleOpen: function() {
            if(this.open == 0){
                this.open = 1;
            }else{
                this.open = 0;
            }
        },
        hideTo: function() {
            $('.box-1').animate({
                left: 0
            });
            $('.box-2').animate({
                left: width + 'px'
            });
            $('.operate').css({
                display: 'block'
            });
            $('.slide-btn').css({
                display: 'none'
            });
        },
        sub: function() {
            $("#saveBtn").attr("disabled", true)
            var range = $("input[name='range']:checked").val(); //表彰类型
            var grade = [];
            var len = $("input[name='gradeid']:checked").length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    grade.push($("input[name='gradeid']:checked").eq(i).val());
                }
                var organizeID = grade.join(',');
                var studentId = 0;
            } else {
                var organizeID = args.organizeID;
                var studentId = args.studentId; //表彰学生
            }

            if ($("#content").val().length > 30) {
                var content = $("#content").val().substring(0, 30);
            } else {
                var content = $("#content").val(); //表彰内容
            }

            var img = index.img != '' && index.img != undefined ? index.img.substring(1) : args.img.substring(1);
            $.ajax({
                type: 'POST',
                url: baseURL + '/commend',
                data: {
                    openID: args.u,
                    range: range,
                    content: content,
                    img: img,
                    studentId: studentId,
                    organizeID: organizeID,
                    access: this.open,
                    description:this.detail
                },
                success: function(data) {
                    layer.alert("表彰成功！", {icon: 1}, function(){
                        location.href = '../mien.html?' + 'u=' + args.u;
                    });
                },
                error: function(data) {
                    layui.use('layer', function() {
                        var layer = layui.layer;
                        layer.alert(data.responseJSON, {
                            icon: 2,
                        })
                    });
                }
            })

        }
    }
})
begin();
//获取教师对应班级
function begin() {
    //选择学生页面跳转后填充
    if (args.studentName !== undefined) { //表彰对象
        $("#student").html(args.studentName);
    }
    if (args.range !== undefined && args.range != '') { //表彰类型
        $("input[name='range']").each(function() {
            if ($(this).val() == args.range) {
                $(this).prop('checked', true);
            }
        });
    }
    if (args.img !== undefined && args.img != '') { //表彰模板
        $('.imgBox').css('border-color', '#e6e6e6');
        $(".imgBox img").each(function() {
            if ($(this).attr('src') == args.img) {
                $('.imgBox').css('border-color', '#e6e6e6');
                $(this).parent().css('border-color', 'red');
            }
        });
    }
    if (args.content !== undefined && args.content != '') { //表彰内容
        index.content = args.content;
    }
    $.ajax({
        type: 'GET',
        url: baseURL + '/teacherClass',
        data: {
            openID: args.u
        },
        success: function(data) {
            index.grade = data;
        },
        error: function() {
            // alert('班级信息加载失败！');
        }
    })
}
