$(function () {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1;
  //八月之前是上半学年，八月之后是下半学年
  if (nowMonth < 8) {
    var time = nowYear - 1;
  } else {
    var time = nowYear;
  }
  var classes = new Vue({
    el: "#classes",
    data: {
      organization: null,
      auth: null,
      count: null,
      allYear: [],
      getNowYear: 0,//获取当前学年
    },
    methods: {
      delete: function (id) {
        layer.confirm("确定删除？",{fixed: false, shade: false}, function(){
            $.ajax({
              type: "POST",
              url: baseURL + '/deleteClassOrganization',
              data: {
                id: id,
                schoolYear: time
              },
              success: function (data) {
                classes.organization = data;
                layer.alert("删除成功",{
                    icon: 1,
                })
                classajax();

              },
              error: function () {
                // layui.use('layer', function () {
                //   var layer = layui.layer;
                //   layer.alert("删除失败！", { icon: 5 })
                // });
                layer.alert("删除失败！", {
                    icon: 2,
                })
              },
            });
        })
      },
      edit: function (id) {
        ope("编辑", './classedit.html?id=' + id);
      },
      addclass: function () {
        ope("新增班级", './addClass.html');
      },
      skip: function (id) {
        window.location.href = "classinfo.html?id=" + id;
      }
    }
  });
  //按学年搜索
  $('#year').change(function () {
    classajax();
  })

  //初始化班级列表
  function classajax() {
    var arr = {};
    var response1 = [];
    //获取学校组织结构
    $.ajax({
      type: "GET",
      url: baseURL + '/getOrganizate?schoolYear=' + classes.getNowYear,
      success: function (response) {
        if (response) {
          var index = 0;
          for (var i = 0; i < response.class.length; i++) {
            if (response.class[i].parent == 0) {
              response.class[i].count = response.count[index];
              index++;
            }
          }
          classes.organization = response.class;
        }else{
          classes.organization = [];
        }
      }
    });
  }
  //获取当前学年
  function getNowYear() {
    $.ajax({
      type: "GET",
      url: baseURL + '/getSchoolYear',
      success: function (data) {
        classes.getNowYear = data;
        classajax();
      }
    });
  }
  getYear();
  //获取全部学年
  function getYear() {
    $.ajax({
      type: "GET",
      url: baseURL + '/schoolYear',
      success: function (data) {
        classes.allYear = data;
        getNowYear();
      }
    });
  }

  //分页
  function page(obj1, len, response) {
    layui.use('laypage', function () {
      var laypage = layui.laypage;
      laypage.render({
        elem: obj1
        , count: len
        , limit: 10
        , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
        , jump: function (obj, first) {
          //首次不执行
          if (!first) {
            var start = (obj.curr - 1) * obj.limit;
            var end = obj.curr * obj.limit;
            classes.organization = response.slice(start, end);
          }
        }
      });
    });
  }

  //新增班级
  var addClass = new Vue({
    el: "#addClass",
    data: {
      grade: null,
    },
    methods: {
      put: function () {
        var parent = $('#grade').val();
        var name = $("#addname").val();
        var location = $('#addplace').val();
        //新增班级
        $.ajax({
          type: 'POST',
          url: '/classplate-API/api/addnewClass',
          data: {
            schoolYear: time,
            name: name,
            parent: parent,
            location: location
          },
          success: function (data) {
            layui.use('layer', function () {
              var layer = layui.layer;
              layer.alert("新增成功！", { icon: 1 });
            })
          },
          error: function () {
            alert('获取年级组织结构失败！');
          }
        });
      }
    }
  });

  //新增班级初始化
  addclassajax();
  function addclassajax() {
    $.ajax({
      type: 'POST',
      url: '/classplate-API/api/addClass?schoolYear=' + time,
      success: function (data) {
        addClass.grade = data;
      }
    });
  }

  //检查权限
  authCheck();
  function authCheck() {
    $.ajax({
      type: "GET",
      url: baseURL + '/authCheck',
      data: { action: "classList/edit" },
      success: function (data) {
        classes.auth = data.auth;
      }
    });
  }

  //弹窗
  function ope(title, src) {
    layui.use('layer', function () {
      var index = layer = layui.layer;
      layer.open({
        type: 2,
        title: title,
        shadeClose: true,
        shade: false,
        fixed: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['450px', '430px'],
        content: src,
      });
    })
  }

});
