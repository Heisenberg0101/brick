$(function(){
	var visitor = new Vue({
    el: "html",
    data: {
      currentFunction: null,
      visitorList: [],
      visitorStatus: null,
      visitorCount: null,
      exportReason:null,
      auth:null,
      exportUrl : baseURL + "/exportVisitor",
    },

    methods: {
      finish: function(data,status){
        if(status == 3){
          layer.msg('请勿重复操作', {icon: 5,fixed:false});
          return false;
        }else if(status == 2){
          layer.msg('本条记录已结束', {icon: 5,fixed:false});
          return false;
        }else{
          $.ajax({
            type: "GET",
            url: baseURL + '/visitorFinish/'+data,
            success: function(response) {
              layer.msg(response.message, {icon: 1,fixed:false});
              refreshVisitorManage();
            },
            error: function(response) {
              layer.alert(response.responseJSON.message,{
                  icon : 5,
              })
            }
          });
        }
      },

      delete: function(id,name){
        layer.confirm('确定删除?', {icon: 3, title:'提示',fixed:false}, function(index){
          $.ajax({
            type: "POST",
            url: baseURL + '/delVisitor/'+id,
            success: function(data) {
              layer.alert(data.message, {icon: 1,fixed:false});
              refreshVisitorManage();
            },
            error: function(response) {
              layer.alert(response.responseJSON.message,{
                  icon : 5,
                  fixed:false
              })
            }
          });
        })
      },

      search: function(){
        //搜索条件
        var teacher = $("#searchVisitor").val();
        var data = {};
        data.visitorDate = $("#visitorDate").val();
        data.reason = visitor.exportReason;
        data.status = visitor.visitorStatus;
        data.name = teacher;
        paging(data);
        layuiPage();
      }
    }
  });

  allCounts();
  refreshVisitorManage();

  // 初始化加载列表
  function refreshVisitorManage() {
    // 加载层
    var index = layer.load(0, {
      shade: [0.2,'#fff']
    });
    var data = {};
    paging(data);
    layuiPage();
    layer.close(index);
  };

  // layui分页组件
  function layuiPage(){
    layui.use(['laypage', 'layer'], function(){
      var laypage = layui.laypage
      ,layer = layui.layer;
        laypage.render({
        elem: 'vPage'
        ,count: visitor.visitorCount
        ,layout: ['count', 'prev', 'page', 'next', 'limit']
        ,jump: function(obj,first){
          var data = {};
          data.limit = obj.limit;
          data.offset = obj.curr;
          data.status = visitor.visitorStatus;
          data.name = $("#searchVisitor").val();
          data.visitorDate = $("#visitorDate").val();
          data.reason = visitor.exportReason;
          paging(data);
        }
      });
    })
  }

  // 初始化总条数
  function allCounts(){
    $.ajax({
      type: "GET",
      async:false,
      url: baseURL + '/VisitorCounts',
      success: function(response) {
        visitor.visitorCount = response;
      },
      error: function(response) {
        layer.alert(response.responseJSON.message,{
          icon : 5,
        })
      }
    });
  }

  // 分页请求
  function paging(data){
    var index1 = layer.load(0, {
      shade: [0.2,'#fff']
    });
    $.ajax({
      type: "GET",
      async:false,
      url: baseURL + '/pageVisitor',
      data:data,
      success: function(data) {
        visitor.visitorCount = data.length;
        for (var i = data.length - 1; i >= 0; i--) {
          // status 时间
          if( data[i].status == 0 ){
            data[i].replace = '申请访问';
          }else if( data[i].status == 1 ){
            data[i].replace = '同意访问';
            data[i].leave_time = '';
          }else if( data[i].status == 2 ){
            data[i].replace = '拒绝访问';
            data[i].accept_time = '';
            data[i].leave_time = '';
          }else if(data[i].status == 3 ){
            data[i].replace = '结束访问';
          }
        }
        visitor.visitorList = data;
        visitor.exportUrl = baseURL + "/exportVisitor?visitorDate="+$("#visitorDate").val()+"&exportReason="+visitor.exportReason+"&status="+visitor.visitorStatus+"&name="+$("#searchVisitor").val();
        layer.close(index1);
      },
      error: function(response) {
        layer.alert('获取列表失败',{
          icon : 5,
        })
      },
    });
  }

  // 教师搜索
  $("#searchVisitor").keyup(function () {
    var kw = jQuery.trim($(this).val());
    if (kw == "") {
        // $("#append").hide().html("");
        return false;
    }
    var html = "";
    // 数据集
    $.ajax({
      type: "GET",
      url: baseURL + '/searchVisitor/' + kw,
      success: function(data) {
        console.log(data)
        for (var i = 0; i < data.length; i++) {
            if (data[i].indexOf(kw) >= 0) {
                html = html + "<div class='layui-input' style='width: 300px;padding: 9px 5px;cursor: pointer' onmouseenter='getFocus(this)' onClick='getCon(this);'>" + data[i] + "</div>"
            }
            if (html != "") {
          $("#append").show().html(html);
      } else {
          $("#append").hide().html("");
      }
        }
      },
      error: function(response) {
        layer.alert(response.responseJSON.message,{
          icon : 5,
        })
      }
    });
  });
  //检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"visitorList/edit"},
          success: function(data) {
              visitor.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }
});

// 点击
function getFocus(obj) {
  $(".layui-input").removeClass("addbg");
  $(obj).addClass("addbg");
}

// 背景颜色渲染
function getCon(obj) {
  var value = $(obj).text();
  $("#searchVisitor").val(value);
  $("#append").hide().html("");
}
