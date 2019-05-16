
$(function () {
  var noticitons = new Vue({
    el: "#noticitons",
    data: {
      currentFunction: null,
      "article": {},
      "deleted": [],
      "show": [],
      type: null,
      nowtime: null,
      organize: [],
      auth: null,
      depart: null,
      ID: 0,
      sho: 0
    },
    methods: {
      showContent: function (id) {
        $.ajax({
          type: "POST",
          url: baseURL + '/oneNotice',
          data: {
            id: id,
          },
          success: function (data) {
            //alert(JSON.stringify(data));
            layui.use('layer', function () {
              var layer = layui.layer;
              if (data.show.length != 0) {
                layer.alert(data.show[0].content);
              } else {
                layer.alert(data.deleted[0].content);
              }
            });
          },
          error: function () {
            layui.use('layer', function () {
              var layer = layui.layer;
              layer.alert('通知消息添加失败！', { icon: 5 });
            });
          }
        });
      },
      sub: function () {
        //获取选择班级情况
        var zTree = $.fn.zTree.getZTreeObj("treeType");
        var nodes = zTree.getCheckedNodes(true);
        var NodeString = '';
        var organizeID = '';
        $.each(nodes, function (n, value) {
          var status = value.getCheckStatus(true);
          if (!status.half) {
            if (n > 0) {
              NodeString += ',';
            }
            NodeString += value.id;
          }
        });
        var zTree1 = $.fn.zTree.getZTreeObj("treeType1");
        var nodes1 = zTree1.getCheckedNodes(true);
        var NodeString1 = '';
        var user = '';
        $.each(nodes1, function (n, value) {
          var status = value.getCheckStatus(true);
          if (!status.half) {
            if (n > 0) {
              NodeString1 += ',';
            }
            NodeString1 += value.id;
          }
        });
        if (NodeString1.length > 0) {
          var user = NodeString1.split(',');
        }
        var arr = [];
        for (var i = 0; i < user.length; i++) {
          if (parseInt(user[i]) > 0) {
            arr.push(user[i]);
          }
        }
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
          if (newArr.indexOf(arr[i]) == -1) {
            newArr.push(arr[i]);
          }
        }
        if (newArr.length > 0) {
          newArr = newArr.join(',');
        }
        var title = $('#title').val();
        var content = $('#content').val();
        if (!title || !content) {
          layui.use('layer', function () {
            var layer = layui.layer;
            layer.msg('请填写通知标题或内容！', { icon: 5 });
          });
          return;
        }
        var time = $('#time').val();
        console.log({
          departmentId: noticitons.ID,
            title: title,
            content: content,
            time: time,
            organizeID: NodeString,
            publisher: noticitons.publisher,
            teacherId: newArr
        })
        $.ajax({
          type: "POST",
          url: baseURL + '/saveNotice',
          data: {
            departmentId: noticitons.ID,
            title: title,
            content: content,
            time: time,
            organizeID: NodeString,
            publisher: noticitons.publisher,
            teacherId: newArr
          },
          success: function (data) {
            refreshNotifications();
            layer.closeAll('page');
            layui.use('layer', function () {
              var layer = layui.layer;
              layer.alert('通知消息添加成功！', { icon: 1 });
            });
          },
          error: function () {
            layui.use('layer', function () {
              var layer = layui.layer;
              layer.alert('通知消息添加失败！', { icon: 5 });
            });
          }
        });
      },
      editNotice: function (id) {
        layui.use('layer', function () {
          var layer = layui.layer;
          layer.open({
            type: 2,
            title: '添加通知消息',
            area: ['400px', '450px'],
            shade: 0,
            fixed: false,
            content: './noticeEdit.html' + '?id=' + id,
          });
        });
      },
      pub: function (id) {
        noticitons.sho = id;
      },
      addNews: function () {
        //设置zetree
        var setting = {
          check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: { "Y": "s", "N": "ps" }
          },
          data: {
            simpleData: {
              enable: true
            }
          }
        };
        //加载层
        index2 = layer.load(0, { shade: false }); //0代表加载的风格，支持0-2
        layer.close(index2);
        //页面层
        layui.use('layer', function () {
          var layer = layui.layer;
          layer.open({
            type: 1,
            title: '添加通知消息',
            area: ['430px', '450px'],
            shade: 0,
            fixed: false,
            content: $('#addnotice'),
          });
        });
        $.getJSON(baseURL + '/getOrganization', function (res) {
          $.fn.zTree.init($("#treeType"), setting, res);
          var zTree = $.fn.zTree.getZTreeObj("treeType");
          zTree.expandAll(false);

        });
        //获取教师
        $.getJSON(baseURL + '/teacherGroup', function (res) {
          res.push({ id: -1, name: "全部门" });
          $.fn.zTree.init($("#treeType1"), setting, res);
          var zTree = $.fn.zTree.getZTreeObj("treeType1");
          zTree.expandAll(false);
        });
        //发布者
        $.ajax({
          type: "GET",
          url: baseURL + '/departmentShow/',
          success: function (data) {
            noticitons.depart = data;
          }
        });
        // 获取当前时间
        $.ajax({
          type: 'GET',
          url: baseURL + '/wechattime',
          success: function (data) {
            noticitons.nowtime = data;
          }
        });
        //获取发布人
        $.ajax({
          type: "GET",
          url: baseURL + '/isUserLogin',
          success: function (result) {
            noticitons.publisher = result.user;
          }
        })

      },
      add: function () {
        noticitons.type = $('#addnews').text();
        //alert(noticitons.type);
        refreshNotifications();
      },
      remove: function () {
        noticitons.type = $('#removenews').text();
        //alert(noticitons.type);
        refreshremove();
      },
      deleteArticle: function (article) {
        layer.confirm('确定删除?', function (index) {
          if (article.ID) {
            //删除通知(软删除)
            $.ajax({
              type: "DELETE",
              url: baseURL + '/notice/' + article.ID,
              success: function (response) {
                  layer.alert("删除成功！",{
                      icon: 1,
                  })
                  refreshNotifications();
              },
              error: function (response) {
                alert('删除通知时出错');
              }
            });
          } else {
            // 成功创建之前删除
            noticitons.show.shift();
          }
          layer.close(index);
        });
      },
      recoveryArticle: function (article) {
        //alert(JSON.stringify(article));
        $.ajax({
          type: "GET",
          url: baseURL + '/recover',
          data: {
            ID: article.ID
          },
          success: function (response) {
            //alert(JSON.stringify(response));
            refreshremove();
          },
          error: function (response) {
            alert('通知恢复失败！');
          }
        });
      },
      //发布范围详情页
      detail: function (str) {
        $.ajax({
          type: "GET",
          url: baseURL + '/getNoticeDetail/' + str.ID,
          success: function (response) {
            noticitons.organize = [];
            noticitons.organize = response;
            //alert(JSON.stringify(organize));
            layui.use('layer', function () {
              var layer = layui.layer;
              var index = layer.open({
                closeBtn: 0,
                type: 1,
                area: ['400px', '450px'],
                title: '发布范围',
                skin: 'layui-layer-demo', //加上边框
                content: $('#participants'),
                btn: ['关闭'],
                fixed: false,
                yes: function (index, layero) {
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
      departSub: function () {
        var departID = $('#departID').val();
        noticitons.ID = departID;
        layer.close(layer.index);
      }
    }
  });
  //获取通知列表
  refreshNotifications();
  function refreshNotifications() {
    $.ajax({
      type: "GET",
      url: baseURL + '/noticeList',
      data: {
        type: 0
      },
      success: function (response) {
        //将类数组对象转换成数组
        response.show = Object.values(response.show);
        noticitons.show = response.show.slice(0, 10);
        layui.use('laypage', function () {
          var laypage = layui.laypage;
          laypage.render({
            elem: 'page'
            , count: response.show.length//数据总数，从服务端得到
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            , jump: function (obj, first) {
              if (!first) {
                var start = (obj.curr - 1) * obj.limit;
                var end = obj.curr * obj.limit;
                noticitons.show = response.show.slice(start, end);
              }
            }
          });
        });
      }
    });
  };
  // var ind = null;
  // function zTreeOnCheck(event, treeId, treeNode) {
  //   if (treeNode.name == "全校") {
  //     $.ajax({
  //       type: "GET",
  //       url: baseURL + '/departmentShow/',
  //       success: function (data) {
  //         noticitons.depart = data;
  //         ind = ope("选择部门", "#department", '350px', '400px');
  //       },
  //       error: function () {
  //         alert('数据加载失败！');
  //       }

  //     });
  //   }
  // }

  //检查权限
  authCheck();
  function authCheck() {
    $.ajax({
      type: "GET",
      url: baseURL + '/authCheck',
      data: { action: "announcementList/edit" },
      success: function (data) {
        noticitons.auth = data.auth;
      },
      error: function (response) {
        layer.alert('失败,请重试', {
          icon: 2,
        })
      },
    });
  }

});

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
      $('#classNew').css({ display: none });
    },
    error: function (response) {
      console.log(response)
      layer.alert(response.message, {
        icon: 2,
      })
    }
  });
})
//弹窗
function ope(title, obj, width, height) {
  layui.use('layer', function () {
    var layer = layui.layer;
    layer.open({
      type: 1,
      title: title,
      area: [width, height],
      content: $(obj),
      fixed: false,
      end: function (index, layero) {
        $(obj).css({ display: "none" });
      },
    });
  });
}

//选择时间插件
layui.use('laydate', function () {
  var laydate = layui.laydate;

  laydate.render({
    elem: '#time',
    type: 'datetime',
    format: "yyyy-MM-dd HH:mm:ss"
  });
});
