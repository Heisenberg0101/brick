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
  if (args.p) {
    serviceID = parseInt(args.p);
  }
    var serviceView = new Vue({
    el: 'body',
    data: {
     openID:window.openID,
     services:{

     },
     dist:{}
    },
    methods: {
      savePage: function() {
          $("#id-savePage").attr("disabled", true)
          var data = {};
          data.operate = serviceView.services.operate;
          data.id = serviceView.services.id;
          $.ajax({
            type: 'POST',
            url: baseURL + '/ServiceOperate',
            data: data,
            success: function(data) {
              // 家校服务模板消息推送
              $.ajax({
              type: 'POST',
              url: baseURL + '/sendServiceBack',
              data: {
                name: serviceView.services.name,
                openID:serviceView.services.openID,
                operate:serviceView.services.operate,
                id:serviceView.services.id
              },
              success: function(data) {

              },
              error: function(data){
                layer.open({
                  content: '模板消息推送失败'
                  ,skin: 'msg'
                  ,time: 2 //2秒后自动关闭
                });
              }
            });
              //信息框
            layer.open({
              content: '保存成功'
              ,btn: '确定'
              ,shadeClose: false
              ,yes: function(index){
                location.href = './service.html?p=' + data.ID + '&u=' + openID;
              }
            });
            },
            error:function(data){
              layer.open({
                content: data.responseJSON.message
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
              });
            }
          });

      },

    }
  });

  if (serviceID && (serviceID !== 0)) {
    $.ajax({
      type: 'POST',
      url: baseURL + '/ServiceView',
      data:{
        serviceID: serviceID
      },
      success: function(data) {
        if( data.status == 0 ){
          data.status = '待审核';
        }else if( data.status == 1 ){
          data.status = '同意申请';
        }else if( data.status == 2 ){
          data.status = '拒绝申请';
        }
      serviceView.services = data;
      // 获取申请人身份
      $.ajax({
        type: 'GET',
        url: baseURL + '/isbind',
        data: {
          openID: openID
        },
        success: function(data) {
          //alert(JSON.stringify(data));
          console.log(serviceView.services.status)
          if(serviceView.services.status == '同意申请'){
            $("#picker").picker({
              title: "服务类型",
              cols: [
                {
                  textAlign: 'center',
                  values: ['结束申请']
                }
              ]
            });
          }else{
            if(data.verifyState){
              $("#picker").picker({
                title: "服务类型",
                cols: [
                  {
                    textAlign: 'center',
                    values: ['同意申请', '拒绝申请']
                  }
                ]
              });
            }else{
              $("#picker").picker({
                title: "服务类型",
                cols: [
                  {
                    textAlign: 'center',
                    values: ['结束申请', '撤销申请',]
                  }
                ]
              });
            }
          }
          layer.close(index);
        },
        error:function(data){
          layer.open({
            content: '获取身份信息失败'
            ,skin: 'msg'
            ,time: 2
          });
        }
      });
      },
      error:function(data){
        layer.open({
          content: "获取失败"
          ,skin: 'msg'
          ,time: 2 //2秒后自动关闭
        });
      }
    });
  }

});
