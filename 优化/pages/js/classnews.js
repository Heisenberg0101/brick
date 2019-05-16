var typeAll = null;
$(function () {

  // 班级新闻列表
  var classnewslist = new Vue({
    el: "#classnewslist",
    data: {
      currentFunction: null,
      alllists: null,
      lists: null,
      type: null,
      count: null,
      number: null,
      picType: null,
      auth: null,
      organize: [],
      classes:[],//获取所有班级组织结构
      classId:0,//当前搜索的班级
    },
    methods: {
      chooseClass:function(id){
        //按班级搜索班级动态
        $.ajax({
          type: "get",
          url: baseURL + '/getClassNews',
          data:{
            organizeID:id
          },
          success: function (data) {
            classnewslist.lists = data;
            console.log(data);
            classnewslist.lists = data.slice(0, 10);
            // 获取新闻总数
            classnewslist.count = data.length;

            layui.use(['laypage'], function () {
              var laypage = layui.laypage;
              // 实例化laypage
              laypage.render({
                elem: 'news_page'
                , count: classnewslist.count
                , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                , limit: 10
                , limits: [5, 10, 15]
                , jump: function (obj, first) {
                  //obj包含了当前分页的所有参数，比如：
                  var nowpage = obj.curr;
                  var nowlimt = obj.limit;
                  //首次不执行
                  if (!first) {
                    var start = (nowpage - 1) * nowlimt;
                    var end = nowpage * nowlimt;
                    classnewslist.lists = data.slice(start, end);
                  }
                }
              });
            });
          }
        });
      },
      // 编辑新闻
      editnews: function (id) {
        // console.log(id)
        layer.open({
          type: 2,
          shadeClose: true,
          shade: false,
          maxmin: true, //开启最大化最小化按钮
          shadeClose: true,
          fixed: false,
          shade: false,
          maxmin: true, //开启最大化最小化按钮
          area: ['450px', '400px'],
          content: './classnewsedit.html' + '?id=' + id,
        });
      },
      // 删除新闻
      delnews: function (id) {
        var type = $("#classnewstype").val();
        // 发送给后台删除
        layer.confirm("确定删除？", function(){
            $.ajax({
              type: "DELETE",
              url: baseURL + '/delclassnew/' + id,
              data: { type: type },
              success: function (data) {
                // 获取新数据赋值
                classnewslist.type = data.type;
                classnewslist.alllists = data.lists;
                classnewslist.lists = classnewslist.alllists.slice(0, 10);
                classnewslist.count = data.count;
                // 友好提示
                layer.alert('删除成功', {
                  icon: 1,
                })
                classnewslistajax();

                // layui.use(['laypage'], function(){
                //     var laypage = layui.laypage;
                //     // 实例化laypage
                //     laypage.render({
                //       elem: 'news_page'
                //       ,count: classnewslist.count
                //       ,layout:['count', 'prev', 'page', 'next', 'limit', 'skip']
                //       ,limit: 10
                //       ,limits:[5,10,15]
                //       ,jump: function(obj, first){
                //         //obj包含了当前分页的所有参数，比如：
                //         var nowpage = obj.curr;
                //         var nowlimt = obj.limit;
                //         //首次不执行
                //         if(!first){
                //             var start = (nowpage-1)*nowlimt;
                //             var end = nowpage*nowlimt;
                //             classnewslist.lists = classnewslist.alllists.slice(start, end);
                //         }
                //       }
                //     });
                // });
              },
              error: function (response) {
                // 友好提示
                layer.alert('删除失败,请重试', {
                  icon: 2,
                })
              },
            });
        })
      },
      allnews: function () {
        $.ajax({
          type: "GET",
          url: baseURL + '/classnewArticleList',
          success: function (data) {
            $('#news_page').css({ display: "block" });
            // 清除type值
            $("#classnewstype").val('');
            // 获取新闻类别
            classnewslist.type = data.type;
            // 获取新闻列表
            classnewslist.alllists = data.lists;
            classnewslist.alllists = Object.values(classnewslist.alllists);
            classnewslist.lists = classnewslist.alllists.slice(0, 10);
            // 获取新闻总数
            classnewslist.count = data.count;

            layui.use(['laypage'], function () {
              var laypage = layui.laypage;
              // 实例化laypage
              laypage.render({
                elem: 'news_page'
                , count: classnewslist.count
                , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                , limit: 10
                , limits: [5, 10, 15]
                , jump: function (obj, first) {
                  //obj包含了当前分页的所有参数，比如：
                  var nowpage = obj.curr;
                  var nowlimt = obj.limit;
                  //首次不执行
                  if (!first) {
                    var start = (nowpage - 1) * nowlimt;
                    var end = nowpage * nowlimt;
                    classnewslist.lists = classnewslist.alllists.slice(start, end);
                  }
                }
              });
            });
          },
          error: function () {
            layer.alert('巡查任务加载失败，请重试', {
              icon: 2,
            })
          }
        })
      },
      choosetype: function (id) {
        classnewslist.picType = id;
        var type = id;
        $.ajax({
          type: "GET",
          url: baseURL + '/classnewArticleList',
          data: { type: type },
          success: function (data) {
            $('#news_page').css({ display: "block" });
            if (data.message) {
              classnewslist.type = typeAll;
              classnewslist.lists = null;
              $('#news_page').css({ display: "none" });
              return;
            }
            $("#classnewstype").val(type);
            // 获取新闻类别
            classnewslist.type = data.type;
            // 获取新闻列表
            classnewslist.alllists = data.lists;
            // classnewslist.lists = classnewslist.alllists.slice(0, 10);
            classnewslist.lists = classnewslist.alllists;
            // 获取新闻总数
            classnewslist.count = data.count;

            layui.use(['laypage'], function () {
              var laypage = layui.laypage;
              // 实例化laypage
              laypage.render({
                elem: 'news_page'
                , count: classnewslist.count
                , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                , limit: 10
                , limits: [5, 10, 15]
                , jump: function (obj, first) {
                  //obj包含了当前分页的所有参数，比如：
                  var nowpage = obj.curr;
                  var nowlimt = obj.limit;
                  //首次不执行
                  if (!first) {
                    var start = (nowpage - 1) * nowlimt;
                    var end = nowpage * nowlimt;
                    classnewslist.lists = classnewslist.alllists.slice(start, end);
                  }
                }
              });
            });
          },
          error: function () {
            layer.alert('巡查任务加载失败，请重试', {
              icon: 2,
            })
          }
        })
      },
      // 新闻图片展示
      newPicShow: function () {
        // alert(newslist.picType)
        location.href = './classnewpicshow.html';
      },
      //发布范围详情页
      detail: function (str) {
        $.ajax({
          type: "GET",
          url: baseURL + '/getClassnewsDetail/' + str.id,
          success: function (response) {
            classnewslist.organize = [];
            classnewslist.organize = response;
            //alert(JSON.stringify(organize));
            layui.use('layer', function () {
              var layer = layui.layer;
              var index = layer.open({
                type: 1,
                area: ['400px', '450px'],
                title: '发布范围',
                skin: 'layui-layer-demo', //加上边框
                content: $('#participants'),
                shadeClose: true,
                fixed: false,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                // btn: ['关闭'],
                end: function (index, layero) {
                  layer.close(index);
                  $('#participants').css({ display: 'none' });
                }
              });
            });
          },
          error: function (response) {
            layer.alert('无法加载发布范围', {
              icon: 5,
            })
          }
        });
      },
      bigImg: function (id) {
        $.ajax({
          type: 'GET',
          url: '/classplate-API/api/classnewsedit/',
          data: { id: id },
          success: function (data) {
            $(".big_img .swiper-wrapper").children().remove();
            $(".swiper-pagination2").children().remove();
            var img = data.thumbnail.split(',');


            for (var i = 0; i < img.length; i++) {
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
          error: function (data) {
            alert('动态获取失败！');
          },
        });
      },
    }
  });

  //初始化班级动态列表
  classnewslistajax();
  // Ajax请求数据方法
  function classnewslistajax() {
    // 页面加载请求,打开遮罩层
    var index = layer.load(0, {
      shade: [0.2, '#fff']
    });
    var allcount;
    $.ajax({
      type: "GET",
      url: baseURL + '/classnewArticleList',
      success: function (data) {
        // 获取新闻类别
        classnewslist.type = data.type;
        //全局变量保存动态类型
        typeAll = classnewslist.type;
        // 获取新闻列表
        classnewslist.alllists = data.lists;
        classnewslist.alllists = Object.values(classnewslist.alllists);
        classnewslist.lists = classnewslist.alllists.slice(0, 10);
        // 获取新闻总数
        classnewslist.count = data.count;
        layer.close(index);

        layui.use(['laypage'], function () {
          var laypage = layui.laypage;
          // 实例化laypage
          laypage.render({
            elem: 'news_page'
            , count: classnewslist.count
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
            , limit: 10
            , limits: [5, 10, 15]
            , jump: function (obj, first) {
              //obj包含了当前分页的所有参数，比如：
              var nowpage = obj.curr;
              var nowlimt = obj.limit;
              //首次不执行
              if (!first) {
                var start = (nowpage - 1) * nowlimt;
                var end = nowpage * nowlimt;
                classnewslist.lists = classnewslist.alllists.slice(start, end);
              }
            }
          });
        });
      }
    })

    //获取所有班级组织结构
    $.ajax({
      type: "GET",
      url: baseURL + '/teacherClass',
      data: { action: "classnewsList/edit" },
      success: function (data) {
        classnewslist.classes = data;
      }
    });
  }

  //检查权限
  authCheck();
  function authCheck() {
    $.ajax({
      type: "GET",
      url: baseURL + '/authCheck',
      data: { action: "classnewsList/edit" },
      success: function (data) {
        classnewslist.auth = data.auth;
      }
    });
  }

  // 获取当前时间
  $.ajax({
    type: 'GET',
    url: baseURL + '/wechattime',
    success: function (data) {
      classnewspublish.nowtime = data;
    }
  });

  // 班级新闻发布
  var classnewspublish = new Vue({
    el: "#classnewspublish",
    data: {
      currentFunction: null,
      type: null,
      organizeID: null,
      nowtime: null
    },
    methods: {
      // 新闻发布
      addclassnews: function () {
        var img = [];
        var len = $('.imgBox').length;
        for (var i = 0; i < len; i++) {
          var srcAll = $('.imgBox').eq(i).find('img').attr('src');
          var index = srcAll.indexOf('/uploads');
          var src = srcAll.substring(index);
          img.push(src);
        }
        img = img.join(',');
        // 获取表单数据
        var time = $("#time").val();
        var title = $("#classnewspublish_title").val();
        var description = $("#classnewspublish_description").val();
        var type = $("#classnewspublish_type").val();
        // var thumbnail = $("#classnewspublish_photo_names").val();
        var thumbnail = img;
        //班级id
        var organizeIDs = [];
        $('input[name="organizeID"]:checked').each(function () {
          organizeIDs.push($(this).val());
        });
        var organizeID = organizeIDs.join(',');
        // 发送给后台添加
        $.ajax({
          type: "POST",
          url: baseURL + '/addclassnews',
          data: { title: title, description: description, type: type, thumbnail: thumbnail, organizeID: organizeID, time: time },
          success: function (data) {
            // 获取新数据赋值
            classnewspublish.type = data.type;
            // 清空输入框
            $("#classnewspublish_title").val('');
            $("#classnewspublish_description").val('');
            // 友好提示
            layer.alert('添加成功', {
              icon: 1,
            })
          },
          error: function (response) {
            // 友好提示
            layer.alert('添加失败,请重试', {
              icon: 2,
            })
          },
        });
      }
    }

  });

  //班级动态发布初始化
  classnewspublishajax();

  // Ajax请求数据方法
  function classnewspublishajax() {
    // 页面加载请求,打开遮罩层
    var index = layer.load(0, {
      shade: [0.2, '#fff']
    });
    //请求地址列表
    $.ajax({
      type: "GET",
      url: baseURL + '/classnews',
      success: function (data) {
        var type = data.type;
        classnewspublish.type = type;
        // 关闭遮罩层
        layer.close(index);
      },
      error: function (response) {
        layer.close(index);
        layer.alert('班级动态发布加载失败，请重试', {
          icon: 2,
        })
      },
    });

    //班级权限
    $.ajax({
      type: 'GET',
      url: baseURL + '/classAddAuth',
      success: function (data) {
        classnewspublish.organizeID = data.organizeID;
      },
      error: function (response) {
        alert('列表加载失败，请重试');
      },
    });

  }

  // 用户信息
  var classaddpeople = new Vue({
    el: "#classaddpeople",
    data: {
      lists: null,
      currentFunction: null,
      phone: null
    },
    methods: {
      // 同步企业微信结构
      enterpriseWeChat: function () {
        $.ajax({
          type: "GET",
          url: baseURL + '/classimportWeChat',
          success: function (data) {
            layer.alert(data.message, {
              icon: 1,
            })
            var data = {};
            data.limit = 10;
            data.offset = 0;
            classaddpeopleajax(data);
            page();
            //alert(JSON.stringify(data));
            // alert(JSON.stringify(data.message));

          },
          error: function (response) {
            layer.alert(data.message, {
              icon: 1,
            })
          }
        });

      },
      // 指定发布人或者取消发布人
      Publisher: function (uid) {
        console.log(uid);
        $("#nodeid").val(uid);
        //加载层
        index2 = layer.load(0, { shade: false }); //0代表加载的风格，支持0-2
        // 获取权限信息
        $.getJSON(baseURL + '/classgetUserOrganization', { 'uid': uid }, function (res) {
          layer.close(index2);
          //页面层
          index = layer.open({
            type: 1,
            area: ['350px', '400px'],
            title: '分配发布权限',
            skin: 'layui-layer-demo', //加上边框
            content: $('#classNew')
          });

          //设置zetree
          var setting = {
            check: {
              enable: true,
              chkStyle: "checkbox",
              chkboxType: { "Y": "", "N": "" }
            },
            data: {
              simpleData: {
                enable: true
              }
            }
          };

          $.fn.zTree.init($("#treeType"), setting, res);
          var zTree = $.fn.zTree.getZTreeObj("treeType");
          console.log(zTree);
          zTree.expandAll(true);

        });



      },
      // 删除发布人
      delPublisher: function (id, name) {
        console.log(name);
        layer.confirm('确认删除姓名为' + name + '的用户?', { icon: 3, title: '提示' }, function (index) {
          $.ajax({
            type: "DELETE",
            url: baseURL + '/classdelPublisher/' + id,
            success: function (data) {
              layer.alert(data.message, {
                icon: 1,
              })
              layer.close(index);
              var data = {};
              data.limit = 10;
              data.offset = 1;
              classaddpeopleajax(data);
              page();
              // alert(JSON.stringify(data));

            },
            error: function (response) {
              layer.alert(data.message, {
                icon: 2,
              })
            }
          });

        })



      },
      // 搜索
      searchTeacher: function () {
        var keyword = $("#classteachername").val();
        if (keyword.length == 0) {
          var data = {};
          data.limit = 10;
          data.offset = 1;
          classaddpeopleajax(data);
          layer.msg("请输入姓名！");
          return false;
        }
        var index = layer.load(0, {
          shade: [0.2, '#fff']
        });
        $.ajax({
          type: "GET",
          url: baseURL + '/classsearchTeacher/' + keyword,
          success: function (data) {
            console.log(data)
            classaddpeople.lists = data;
            layer.close(index);

          },
          error: function (response) {
            layer.msg("没有查找到此用户！");
            layer.close(index);
          }
        });

      },
    }
  });


  //用户信息初始化
  // classaddpeopleajax();//用户表已合并
  // 请求列表方法
  function classaddpeopleajax(data) {
    // 页面加载请求,打开遮罩层
    var index = layer.load(0, {
      shade: [0.2, '#fff']
    });
    $.ajax({
      type: "GET",
      url: baseURL + '/getClassNewsWeChat',
      data: data,
      success: function (response) {
        console.log(response.length)
        classaddpeople.lists = response;
        // page();
        layer.close(index);
      },
      error: function (response) {
        layer.msg("无法加载企业微信用户列表！");
      }
    });

  }
  // page();
  function page() {
    //分页功能
    layui.use(['laypage', 'layer'], function () {
      var laypage = layui.laypage
        , layer = layui.layer;
      var data = {};
      data.limit = 10;
      data.offset = 1;
      $.ajax({
        type: "GET",
        url: baseURL + '/getClassNewsWeChat',
        data: data,
        success: function (response) {
          console.log(response.length)
          classaddpeople.lists = response.slice(0, 10);
          //alert(JSON.stringify(response));
          // layer.close(index);
          laypage.render({
            elem: 'classnews_person'
            , count: response.length
            , limit: 10
            , layout: ['count', 'prev', 'page', 'next', 'limit']
            , jump: function (obj) {
              console.log(obj);
              var data = {};
              data.limit = obj.limit;
              data.offset = obj.curr;
              var start = (obj.curr - 1) * obj.limit;
              var end = obj.curr * obj.limit;
              classaddpeople.lists = response.slice(start, end);
            }
          });
        },
        error: function (response) {
          layer.msg("无法加载企业微信用户列表！");
        }
      });


    })
  }

  //确认分配权限
  $("#classCheck").click(function () {
    var zTree = $.fn.zTree.getZTreeObj("treeType");
    var nodes = zTree.getCheckedNodes(true);
    console.log(nodes)
    var NodeString = '';

    $.each(nodes, function (n, value) {
      if (n > 0) {
        NodeString += ',';
      }
      NodeString += value.id;
    });
    var uid = $("#nodeid").val();
    console.log(NodeString)
    //写入库
    $.ajax({
      type: "GET",
      url: baseURL + '/classpublishAllot/' + uid,
      data: {
        node: NodeString
      },
      success: function (data) {
        layer.alert(data.message, {
          icon: 1,
        })
        layer.close(index);

      },
      error: function (response) {
        console.log(response)
        layer.alert(response.message, {
          icon: 2,
        })
      }
    });
  })

  //删除上传图片
  $('#classnewspublish_photos').on('click', '.close', function () {
    $(this).parent().remove();
  })

  // 大图轮播
  var mySwiper = new Swiper('.swiper-container2', {
    loop: false,
    pagination: '.swiper-pagination2',
  })

  //大图轮播关闭
  $(".big_img").click(function () {
    $(".big_img").css({
      "z-index": -1,
      "opacity": "0"
    });
  });

});
