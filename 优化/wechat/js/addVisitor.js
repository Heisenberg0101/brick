$(function() {
  if (args.u) {
    window.openID = args.u;
  } else {
    layer.open({
      content: '未识别用户'
      ,skin: 'msg'
      ,time: 2 //2秒后自动关闭
    });
  }

  var addVisitor = new Vue({
    el: 'body',
    data: {
     data:{},
     names:[]
    },
    methods: {
      // 发送验证码
      sendSMS: function() {
          var phone = this.data.phone;
          $.ajax({
            type: 'POST',
            url: baseURL + '/sendsms',
            data: {phone: phone},
            success: function(data) {
              alert(data)
            },
            error: function(data) {
              alert(data.responseJSON);
            }
          });
      },
      savePage: function() {
          $('#id-savePage').attr('disabled',true);
        var param = decodeURIComponent($("form").serialize(),true);
        var index = param.indexOf('=');
        var result = param.substr(index + 1,param.length);
        addVisitor.data.people = result;
        var data = {};
        data = addVisitor.data;
        data.openID = openID;
        data.people = result;
        $.ajax({
          type: 'POST',
          url: baseURL + '/saveVisitor',
          data: data,
          success: function(data) {
            // 模板消息推送
            $.ajax({
            type: 'POST',
            url: baseURL + '/sendVisitorManage',
            data: {
              name: addVisitor.data.name,
              phone:addVisitor.data.phone,
              people:addVisitor.data.people,
              id:data
            },
            success: function(data) {
             // alert(JSON.stringify(data));
            },
            error: function(data){
              layer.open({
                  content: data.responseJSON.message
                  ,skin: 'msg'
                  ,time: 2 //2秒后自动关闭
                });
            }
          });
          //信息框
          // layer.open({
          //   content: '提交成功'
          //   ,btn: '确定'
          //   ,shadeClose: false
          //   ,yes: function(index){
          //     location.href = './visitorManage.html?p=' + data.ID + '&u=' + openID;
          //   }
          // });
              layer.alert("提交成功",{icon: 1}, function(){
                  location.href = './visitorManage.html?p=' + data.ID + '&u=' + openID;
              })
          },
          error:function(data){
            layer.open({
              content: data.responseJSON.message
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
            });
          }
        });
        // layer.close(index);
      },

    }
  });
  // layer.close(index);
});
