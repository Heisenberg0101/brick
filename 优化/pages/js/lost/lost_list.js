$(function(){
	var lost = new Vue({
		el:"#lost",
		data: {
            studentLists:null,
            lists:null,
            state:0,
            organize:null,
            type:null,
            allName:null,
            nowValue:null,
            id:null,
            editList:null,
            name:null,
            ID:null,
            nowValue1:null
        },
		methods:{
            //编辑
			edit:function(id,state){
                if(state == 0){
                    ope(2,'编辑','lost_edit.html?id='+id+"&state="+state,'400px','450px');
                }else{
                    lost.allName = null;
                    ope(1,'编辑',$('.people'),'400px','350px','.people');
                    // 加载组织结构
                    $.ajax({
                        type: "GET",
                        url: baseURL + '/getOrganize',
                        success: function(response) {
                            lost.organize = Object.values(response);
                            //初始化编辑列表
                            $.ajax({
                                type: "GET",
                                url: baseURL + '/lost/'+id,
                                data:{state:1},
                                success: function(data) {
                                    $('.show1').hide();
                                    lost.editList = data;
                                    lost.ID = data.organizeID;
                                    if(data.organizeID != 0){
                                        $("input[name='chooseTy1']").eq(0).prop('checked',true);
                                        $('.show1').eq(0).show();
                                        $('.show1').eq(1).show();
                                    }else{
                                        $("input[name='chooseTy1']").eq(1).prop('checked',true);
                                        $('.show1').eq(2).show();
                                    }

                                    for(var i=0;i<lost.organize.length;i++){
                                        if(lost.organize[i].ID == lost.ID){
                                            lost.name = lost.organize[i].name;
                                        }
                                    }
                                },
                                error: function(response) {
                                    layer.alert('失败,请重试',{
                                        icon : 2,
                                        fixed:false
                                    })
                                },
                            });

                        },
                        error: function(response) {
                            alert("'加载组织结构出错!");
                        }
                    });
                }
			},
            //切换
            choose:function(state){
                begin(state);
            },
			enter:function(id){
                // 加载班级列表
                lost.allName = null;
                lost.id = id;
                $.ajax({
                    type: "GET",
                    url: baseURL + '/getOrganize',
                    success: function(response) {
                        lost.organize = response;
                    },
                    error: function(response) {
                        alert("'加载组织结构出错!");
                    }
                });
	            ope(1,'确认',$('.popUp'),'400px','350px','.popUp');
			},
            //删除
            delete:function(id,state){
				layer.confirm("确定删除？", function(){
					$.ajax({
	                    type: "DELETE",
	                    url: baseURL + '/lost/'+id,
	                    success: function(data) {
	                        layer.alert('删除成功！',{
	                            icon : 1,
	                            fixed:false
	                        })
	                        begin(state);
	                    },
	                    error: function(response) {
	                        layer.alert('删除失败,请重试',{
	                            icon : 2,
	                            fixed:false
	                        })
	                    },
	                });
				})
            },
            confirm:function(){
                var organizeID = $('#organizeID').val();
                var name = $('#studentname').val();
                var othername = $('#othername').val();
                if(lost.nowValue == null){
                    lost.nowValue = 0;
                };
                if(lost.nowValue == 0){
                    var data = {
                        id:lost.id,
                        organizeID:organizeID,
                        isSure:1,
                        receiptor:name
                    }
                }else{
                    var data = {
                        id:lost.id,
                        organizeID:0,
                        isSure:1,
                        receiptor:othername
                    }
                }
                $.ajax({
                    type: "post",
                    url: baseURL + '/lost',
                    data:data,
                    success: function(data) {
                         layer.alert('确认成功！',{
                            icon : 1,
                            fixed:false
                        })
                        layer.closeAll('page');
                        begin(1);
                    },
                    error: function(response) {
                        layer.alert('失败,请重试',{
                            icon : 2,
                            fixed:false
                        })
                    },
                });
            },
            bigImg:function(id,state){
                $.ajax({
                        type: "GET",
                        url: baseURL + '/lost/'+id,
                        data:{state:state},
                        success: function(data) {
                            lost.editList = data;
                        },
                        error: function(response) {
                            layer.alert('失败,请重试',{
                                icon : 2,
                                fixed:false
                            })
                        },
                    });
                 $.ajax({
                    type: 'GET',
                    url: baseURL + '/lost/'+id,
                    data:{state:state},
                    success: function(data){
                        // alert(JSON.stringify(data));
                         $(".big_img .swiper-wrapper").children().remove();
                         $(".swiper-pagination2").children().remove();
                         var img = data.img.split(',');

                         for(var i=0;i<img.length;i++){
                             $(".big_img .swiper-wrapper").append('<div class="swiper-slide"><div class="cell"><img src="' + img[i] + '" / ></div></div>');
                           }

                          mySwiper.updateSlidesSize();
                          mySwiper.updatePagination();
                          $(".big_img").css({
                              "z-index": 1001,
                              "opacity": "1"
                          });
                          mySwiper.slideTo(0, i, false);
                    },
                    error:function(data) {
                        alert('动态获取失败！');
                    },
                });
           },
           esitSub:function(id){
                var organizeID = parseInt($('#organizeID1').val());
                var name = $('#studentname1').val();
                var othername = $('#othername1').val();
                var receiveDate = $('#receiveDate').val();
                if(lost.nowValue1 == null){
                    lost.nowValue1 = 0;
                };
                if(lost.nowValue1 == 0){
                    var data = {
                        id:id,
                        organizeID:organizeID,
                        isSure:1,
                        receiptor:name,
                        receiveDate:receiveDate
                    }
                }else{
                    var data = {
                        id:id,
                        organizeID:0,
                        isSure:1,
                        receiptor:othername,
                        receiveDate:receiveDate
                    }
                }
                $.ajax({
                    type: "post",
                    url: baseURL + '/lost',
                    data:data,
                    success: function(data) {
                         layer.alert('编辑成功！',{
                            icon : 1,
                            fixed:false
                        },function(){
                            begin(1);
                            layer.closeAll();
                        })
                    },
                    error: function(response) {
                        layer.alert('失败,请重试',{
                            icon : 2,
                            fixed:false
                        })
                    },
                });
           }
		}
	});

    //页面初始化
    begin(0);
    function begin(state){
        $.ajax({
            type: "GET",
            url: baseURL + '/lost',
            data:{state:state},
            success: function(data) {
                for(var i=0;i<data.length;i++){
                    data[i].img = data[i].img.split(',');
                }
                lost.lists = data;
                lost.state = state;
            },
            error: function(response) {
                layer.alert('失败,请重试',{
                    icon : 2,
                    fixed:false
                })
            },
        });
    }

    //编辑时间选择
    layui.use('laydate',function(){
        var laydate = layui.laydate;
        laydate.render({
            elem: '.getTime',
            type: 'datetime',
            format:"yyyy-MM-dd HH:mm:ss"
        });
    })

    //选中确认方式
    $('.chooseTy').change(function(){
        var index = parseInt($(this).val());
        lost.nowValue = index;
        chooseType(index,'.show');
    })

    //选中确认方式
    $('.chooseTy1').change(function(){
        var index = parseInt($(this).val());
        lost.nowValue1 = index;
        chooseType(index,'.show1');
    })

    function chooseType(index,obj){
        if(index == 0){
            $(obj).css('display',"none");
            $(obj).eq(0).css('display',"block");
            $(obj).eq(1).css('display',"block");
        }else{
            $(obj).css('display',"none");
            $(obj).eq(2).css('display',"block");
        }
        return false;
    }

    //模糊搜索姓名
    $("#studentname").bind('input propertychange',function(){
        searchName('.allName','#organizeID','#studentname')
    })

    //模糊搜索姓名
    $("#studentname1").bind('input propertychange',function(){
        searchName('.allName1','#organizeID1','#studentname1')
    })

    function searchName(obj1,obj2,obj3){
        $(obj1).css('display','block');
        var organizeID = $(obj2).val();
        var name = $(obj3).val();
        $.ajax({
            type: "GET",
            url: baseURL + '/searchStudent',
            data:{
                organizeID:organizeID,
                name:name
            },
            success: function(data) {
                lost.allName = data;
            },
            error: function(response) {
                layer.alert('失败,请重试',{
                    icon : 2,
                    fixed:false
                })
            },
        })
    }

    //选中姓名
    $('.allName').on('click','li',function(){
        var value = $(this).html();
        chooseName('#studentname','.allName',value)
    })

    //选中姓名
    $('.allName1').on('click','li',function(){
        var value = $(this).html();
        chooseName('#studentname1','.allName1',value)
    })

    function chooseName(obj1,obj2,value){
        $(obj1).val(value);
        $(obj2).css('display','none');
    }
    // 大图轮播
    var mySwiper = new Swiper('.swiper-container2', {
        loop: false,
        pagination: '.swiper-pagination2',
    })

    //大图轮播关闭
    $(".big_img").click(function(){
      $(".big_img").css({
        "z-index": -1,
        "opacity": "0"
     });
   });
});
