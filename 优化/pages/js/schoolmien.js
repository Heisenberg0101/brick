$(function(){
    // 新闻列表
    var newslist = new Vue({
        el: "#newslist",
        data: {
            alllists: null,
            lists: null,
            count: null,
            auth:null
        },
        methods:{
             // 新闻图片展示
            newPicShow: function () {
              location.href = './mienpicshow.html';
            },
            // 删除新闻
            delnews: function (id) {
                // 发送给后台删除
                layer.confirm("确定删除？", function(){
                    $.ajax({
                        type: "DELETE",
                        url: baseURL + '/schoolmienDel/' + id,
                        success: function(data) {
                            // 获取新数据赋值
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

            }
        }

    });

  	//初始化风采列表
  	newslistajax();
    //Ajax请求数据方法
    function newslistajax(){
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        var allcount;
        $.ajax({
            type: "GET",
            url: baseURL +'/schoolmienList',
            success: function(data){
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
                layer.alert('风采列表加载失败，请重试',{
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
          data:{action:"schoolmien/edit"},
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

    //风采发布
    var newspublish = new Vue({
        el: "#newspublish",
        methods: {
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
                var title = $("#newspublish_title").val();
                var thumbnail = img;
                // 发送给后台添加
                $.ajax({
                    type: "POST",
                    url: baseURL + '/schoolmienAdd',
                    data:{title:title, thumbnail:thumbnail},
                    success: function(data) {
                        // 清空输入框
                        $("#newspublish_title").val('');
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

  //删除上传图片
  $('#newspublish_photos').on('click','.close',function(){
    $(this).parent().remove();
  })
});
