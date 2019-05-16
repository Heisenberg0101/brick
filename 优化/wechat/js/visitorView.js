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
    visitorID = parseInt(args.p);
  }

    var visitorView = new Vue({
    el: 'body',
    data: {
     views:{

     },
     dist:{}
    },
    methods: {
      savePage: function() {
          $('#id-savePage').attr('disabled',true);
          var data = {};
          data.operate = visitorView.views.operate;
          data.id = visitorView.views.id;
          $.ajax({
            type: 'POST',
            url: baseURL + '/visitorOperate',
            data: data,
            success: function(data) {
              // 访客模板消息推送
              $.ajax({
              type: 'POST',
              url: baseURL + '/sendVisitorBack',
              data: {
                name: visitorView.views.name,
                openID:visitorView.views.openID,
                operate:visitorView.views.operate,
                id:visitorView.views.id
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
            // layer.open({
            //   content: '保存成功'
            //   ,btn: '确定'
            //   ,shadeClose: false
            //   ,yes: function(index){
            //     location.href = './visitorManage.html?p=' + data.ID + '&u=' + openID;
            //   }
            // });
            layer.alert("保存成功", {icon: 1}, function(){
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

      },

    }
  });
    // layer.close(index);

  if (visitorID && (visitorID !== 0)) {
    $.ajax({
      type: 'POST',
      url: baseURL + '/visitorView',
      data:{
        visitorID: visitorID
      },
      success: function(data) {
        if( data.status == 0 ){
          data.status = '待审核';
        }else if( data.status == 1 ){
          data.status = '同意访问';
        }else if( data.status == 2 ){
          data.status = '拒绝访问';
        }else if(data.status == 3 ){
          data.status = '结束访问';
        }
      visitorView.views = data;
      // 获取访客身份
      $.ajax({
        type: 'GET',
        url: baseURL + '/isbind',
        data: {
          openID: openID
        },
        success: function(data) {
          console.log(visitorView.views.status)
          if(visitorView.views.status == '同意访问'){
            $("#picker").picker({
              title: "来访事由",
              cols: [
                {
                  textAlign: 'center',
                  values: ['结束离校']
                }
              ]
            });
          }else{
            if(data.verifyState){
              $("#picker").picker({
                title: "来访事由",
                cols: [
                  {
                    textAlign: 'center',
                    values: ['同意访问', '拒绝访问']
                  }
                ]
              });
            }else{
              $("#picker").picker({
                title: "来访事由",
                cols: [
                  {
                    textAlign: 'center',
                    values: ['结束离校', '撤销申请',]
                  }
                ]
              });
            }
          }
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
          content: data.responseJSON.message
          ,skin: 'msg'
          ,time: 2 //2秒后自动关闭
        });
      }
    });
  }

});
