
$(function(){

    // 新闻列表
    var newslist = new Vue({
        el: "#newslist",
        data: {
            currentFunction: null,
            alllists: null,
            lists: null,
            type: null,
            count: null,
            number: null,
            picType:null,
            auth:null,

        },
        methods:{
             // 新闻图片展示
            newPicShow: function () {
              // alert(newslist.picType)
              location.href = './newpicshow.html';
            },
            choosetype:function(id){
              newslist.picType = id;
                var type = id;
                $.ajax({
                    type: "GET",
                    url: baseURL +'/newArticleList',
                    data:{type:type},
                    success: function(data){
                        $("#newstype").val(type);
                        // 获取新闻类别
                        newslist.type = data.type;
                        // 获取新闻列表
                        newslist.alllists = data.lists;
                        newslist.lists = newslist.alllists.slice(0,10);
                        // 获取新闻总数
                        newslist.count = data.count;

                        layui.use(['laypage'], function(){
                            var laypage = layui.laypage;
                            // 实例化laypage
                            laypage.render({
                              elem: 'news_page'
                              ,count: newslist.count
                              ,layout:['count', 'prev', 'page', 'next', 'limit', 'skip']
                              ,limit: 10
                              ,limits:[5,10,15]
                              ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：
                                var nowpage = obj.curr;
                                var nowlimt = obj.limit;
                                //首次不执行
                                if(!first){
                                    var start = (nowpage-1)*nowlimt;
                                    var end = nowpage*nowlimt;
                                    newslist.lists = newslist.alllists.slice(start, end);
                                }
                              }
                            });
                        });
                    },
                    error: function () {
                        layer.alert('巡查任务加载失败，请重试',{
                            icon : 2,
                        })
                    }
                })
            },
            allnews:function(){
                $.ajax({
                    type: "GET",
                    url: baseURL +'/newArticleList',
                    success: function(data){
                        // 清除type值
                        $("#newstype").val('');
                        // 获取新闻类别
                        newslist.type = data.type;
                        // 获取新闻列表
                        newslist.alllists = data.lists;
                        newslist.lists = newslist.alllists.slice(0, 10);
                        // 获取新闻总数
                        newslist.count = data.count;

                        layui.use(['laypage'], function(){
                            var laypage = layui.laypage;
                            // 实例化laypage
                            laypage.render({
                              elem: 'news_page'
                              ,count: newslist.count
                              ,layout:['count', 'prev', 'page', 'next', 'limit', 'skip']
                              ,limit: 10
                              ,limits:[5,10,15]
                              ,jump: function(obj, first){
                                //obj包含了当前分页的所有参数，比如：
                                var nowpage = obj.curr;
                                var nowlimt = obj.limit;
                                //首次不执行
                                if(!first){
                                    var start = (nowpage-1)*nowlimt;
                                    var end = nowpage*nowlimt;
                                    newslist.lists = newslist.alllists.slice(start, end);
                                }
                              }
                            });
                        });
                    },
                    error: function () {
                        layer.alert('巡查任务加载失败，请重试',{
                            icon : 2,
                        })
                    }
                })
            },
            // 编辑新闻
            editnews: function (id) {
              console.log(id)
                layer.open({
                    type: 2,
                    shadeClose: true,
                    fixed: false,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['450px','400px'],
                    content: './newseditpublish.html' + '?id=' + id,
                });
            },
            // 删除新闻
            delnews: function (id) {
                var type = $("#newstype").val();
                // 发送给后台删除
                layer.confirm("确定删除？", function(){
                    $.ajax({
                        type: "DELETE",
                        url: baseURL + '/ewArticleListn/' + id,
                        data:{type:type},
                        success: function(data) {
                            // 获取新数据赋值
                            newslist.type = data.type;
                            newslist.alllists = data.lists;
                            newslist.lists = newslist.alllists.slice(0, 10);
                            newslist.count = data.count;
                            newslistajax();
                            // 友好提示
                            layer.alert('删除成功',{
                                icon : 1,
                            })

                            layui.use(['laypage'], function(){
                                var laypage = layui.laypage;
                                // 实例化laypage
                                laypage.render({
                                  elem: 'news_page'
                                  ,count: newslist.count
                                  ,layout:['count', 'prev', 'page', 'next', 'limit', 'skip']
                                  ,limit: 10
                                  ,limits:[5,10,15]
                                  ,jump: function(obj, first){
                                    //obj包含了当前分页的所有参数，比如：
                                    var nowpage = obj.curr;
                                    var nowlimt = obj.limit;
                                    //首次不执行
                                    if(!first){
                                        var start = (nowpage-1)*nowlimt;
                                        var end = nowpage*nowlimt;
                                        newslist.lists = newslist.alllists.slice(start, end);
                                    }
                                  }
                                });
                            });
                        },
                        error: function(response) {
                            // 友好提示
                            layer.alert('删除失败,请重试',{
                                icon : 2,
                            })
                        },
                    });
                })

            },
            bigImg:function(id){
                 $.ajax({
                    type: 'GET',
                    url: '/classplate-API/api/newsedit/',
                    data:{id:id},
                    success: function(data){
                         $(".big_img .swiper-wrapper").children().remove();
                         $(".swiper-pagination2").children().remove();
                         var img = data.thumbnail.split(',');


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
        }

    });

  //初始化校园新闻列表
  newslistajax();
     // Ajax请求数据方法
    function newslistajax(){
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        var allcount;
        $.ajax({
            type: "GET",
            url: baseURL +'/newArticleList',
            success: function(data){
                // 获取新闻类别
                newslist.type = data.type;
                // 获取新闻列表
                newslist.alllists = data.lists;
                newslist.lists = newslist.alllists.slice(0,10);
                // 获取新闻总数
                newslist.count = data.count;
                layer.close(index);

                layui.use(['laypage'], function(){
                    var laypage = layui.laypage;
                    // 实例化laypage
                    laypage.render({
                      elem: 'news_page'
                      ,count: newslist.count
                      ,layout:['count', 'prev', 'page', 'next', 'limit', 'skip']
                      ,limit: 10
                      ,limits:[5,10,15]
                      ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        var nowpage = obj.curr;
                        var nowlimt = obj.limit;
                        //首次不执行
                        if(!first){
                            var start = (nowpage-1)*nowlimt;
                            var end = nowpage*nowlimt;
                            newslist.lists = newslist.alllists.slice(start, end);
                        }
                      }
                    });
                });


            },
            error: function () {
                layer.close(index);
                layer.alert('巡查任务加载失败，请重试',{
                    icon : 2,
                })
            }
        })
    }

    //检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"schoolnewsList/edit"},
          success: function(data) {
              newslist.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

    // 获取当前时间
    $.ajax({
        type: 'GET',
        url: baseURL + '/wechattime',
        success: function(data) {
           newspublish.nowtime=data;
        }
    });

    // 新闻发布
    var newspublish = new Vue({
        el: "#newspublish",
        data: {
            currentFunction: null,
            type:[],
            depart:null,
            nowtime:null
        },
        methods: {
          // 新闻发布
            addnews: function () {
                var img = [];
                var len = $('.imgBox').length;
                for(var i=0;i<len;i++){
                  var srcAll = $('.imgBox').eq(i).find('img').attr('src');
                  var index = srcAll.indexOf('/uploads');
                  var src = srcAll.substring(index);
                  img.push(src);
                }
                img = img.join(',');
                // 获取表单数据
                var time = $("#time").val();
                var title = $("#newspublish_title").val();
                var description = $("#newspublish_description").val();
                var type = $("#newspublish_type").val();
                // var thumbnail = $("#newspublish_photo_names").val();
                var thumbnail = img;
                var departmentId = $("#departmentId").val();
                var link = $("#link").val();
                if (title=='' && description=='') {
                  alert("请输入新闻标题或者新闻描述！");return;
                };
                // 发送给后台添加
                $.ajax({
                    type: "POST",
                    url: baseURL + '/news',
                    data:{title:title, description:description, type:type, thumbnail:thumbnail,departmentId:departmentId,time:time,link:link},
                    success: function(data) {
                        // 获取新数据赋值
                        newspublish.type = data.type;
                        // 清空输入框
                        $("#newspublish_title").val('');
                        $("#newspublish_description").val('');
                        // 友好提示
                        layer.alert('添加成功',{
                            icon : 1,
                        })
                    },
                    error: function(response) {
                        // 友好提示
                        layer.alert('添加失败,请重试',{
                            icon : 2,
                        })
                    },
                });
            }
        }
    });

    //新闻发布初始化
    newspublishajax();
     // Ajax请求数据方法
    function newspublishajax(){
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        //请求地址列表
        $.ajax({
            type: "GET",
            url: baseURL + '/news',
            success: function(data) {
                var type = data.type;
                newspublish.type = type;
                //alert(JSON.stringify(newspublish.type));
                // 关闭遮罩层
                layer.close(index);
            },
            error: function(response) {
                layer.close(index);
                layer.alert('新闻发布页面刷新失败，请重试',{
                    icon : 2,
                })
            },
        });
        //部门选择
        $.ajax({
          type:"GET",
          url: baseURL + '/departmentShow/',
          success:function(data){
             newspublish.depart=data;
          },
          error:function(){
            alert('数据加载失败！');
          }

       });
    }
        // 用户管理
    var addpeople= new Vue({
        el: "#newsperson",
        data: {
        lists: null,
        currentFunction: null,
        phone:null
      },
      methods: {
        // 同步企业微信结构
        enterpriseWeChat: function() {
          $.ajax({
          type: "GET",
          url: baseURL + '/importWeChat',
          success: function(data) {
            layer.alert(data.message,{
                    icon : 1,
                })
            var data = {};
            data.limit = 10;
            data.offset = 0;
            addpeopleajax(data);
            page();
          },
          error: function(response) {
            layer.alert(data.message,{
                    icon : 1,
                })
          }
        });

        },
        // 指定发布人或者取消发布人
        Publisher: function(uid) {
          console.log(uid);
          $("#nodeid").val(uid);
          index2 = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
            // 获取权限信息
          $.getJSON(baseURL + '/getUserOrganization',{'uid':uid}, function(res){
              layer.close(index2);

                  //页面层
                  index = layer.open({
                      type: 1,
                      area:['350px', '400px'],
                      title:'分配发布权限',
                      skin: 'layui-layer-demo', //加上边框
                      content: $('#role')
                  });

                  //设置zetree
                  var setting = {
                      check:{
                          enable:true,
                          chkStyle: "checkbox",
                          chkboxType: { "Y": "", "N": "" }
                      },
                      data: {
                          simpleData: {
                              enable: true
                          }
                      }
                  };

                  $.fn.zTree.init($("#userallot"), setting, res);
                  var zTree = $.fn.zTree.getZTreeObj("userallot");
                  console.log(zTree);
                  zTree.expandAll(true);

          });

        },
        // 删除发布人
        delPublisher: function(id,name) {
            console.log(name);
            layer.confirm('确认删除姓名为'+name+'的用户?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
              type: "DELETE",
              url: baseURL + '/delPublisher/'+id,
              success: function(data) {
                layer.alert(data.message,{
                        icon : 1,
                    })
                layer.close(index);
                 var data = {};
                 data.limit = 10;
                 data.offset = 1;
                 addpeopleajax(data);
                 page();
                // alert(JSON.stringify(data));

              },
              error: function(response) {
                layer.alert(data.message,{
                        icon : 2,
                    })
              }
          });

          })

        },
        // 搜索
        searchTeacher: function() {
          var keyword = $("#teachername").val();
          if(keyword.length == 0){
            var data = {};
            data.limit = 10;
            data.offset = 1;
            addpeopleajax(data);
            layer.msg("请输入姓名！");
            return false;
          }
          var index = layer.load(0, {
            shade: [0.2,'#fff']
          });
          $.ajax({
            type: "GET",
            url: baseURL + '/searchTeacher/'+keyword,
            success: function(data) {
              console.log(data)
               addpeople.lists = data;
               layer.close(index);

            },
            error: function(response) {
              layer.msg("没有查找到此用户！");
              layer.close(index);
            }
          });

        }
      }
    });

function page(){
  //分页功能
    layui.use(['laypage', 'layer'], function(){
      var laypage = layui.laypage
      ,layer = layui.layer;
      var data = {};
      data.limit = 10;
      data.offset = 1;
      $.ajax({
        type: "GET",
        url: baseURL + '/getEnterpriseWeChat',
        data:data,
        success: function(response) {
              addpeople.lists = response.slice(0,10);
              laypage.render({
              elem: 'news_person'
              ,count: response.length
              ,limit:10
              ,layout: ['count', 'prev', 'page', 'next', 'limit']
              ,jump: function(obj){
                console.log(obj);
                var data = {};
                data.limit = obj.limit;
                data.offset = obj.curr;
                var start=(obj.curr-1)*obj.limit;
                var end=obj.curr*obj.limit;
                addpeople.lists = response.slice(start,end);
              }
            });
          },
          error: function(response) {
            layer.msg("无法加载企业微信用户列表！");
          }
        });


    })
}


 // 请求列表方法
 function addpeopleajax(data){
    var index = layer.load(0, {
      shade: [0.2,'#fff']
    });
    $.ajax({
      type: "GET",
      url: baseURL + '/getEnterpriseWeChat',
      data:data,
      success: function(response) {
        //alert(JSON.stringify(response));
        addpeople.lists = response.slice(0,10);
        layer.close(index);
      },
      error: function(response) {
        layer.msg("无法加载企业微信用户列表！");
      }
    });

}

  //确认分配权限
  $("#postform").click(function(){
      var zTree = $.fn.zTree.getZTreeObj("userallot");
      var nodes = zTree.getCheckedNodes(true);
      console.log(nodes)
      var NodeString = '';
      $.each(nodes, function (n, value) {
          if(n>0){
              NodeString += ',';
          }
          NodeString += value.id;
      });
      var uid = $("#nodeid").val();
       console.log(NodeString)
      //写入库
        $.ajax({
          type: "GET",
          url: baseURL + '/publishAllot/'+uid,
          data:{
            node:NodeString
          },
          success: function(data) {
            layer.alert(data.message,{
                    icon : 1,
                })
            layer.close(index);

          },
          error: function(response) {
            console.log(response)
            layer.alert(response.message,{
                    icon : 2,
                })
          }
        });
  })

  //删除上传图片
  $('#newspublish_photos').on('click','.close',function(){
    $(this).parent().remove();
  })

  //大图轮播
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
