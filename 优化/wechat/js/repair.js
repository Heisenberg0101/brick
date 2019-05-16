$(function() {
  if (args.u) {
    window.openID = args.u;
  } else {
    window.openID = "oSfKEsxzumGUzGF7MmN-3WMQXiak";
  }
  $.ajax({
    type: 'POST',
    url: baseURL + '/getpeople',
    success: function(data) {
      page.peoples = data;

    },
    error:function(data){

      alert("加载审核人列表失败");
    }
  });

  var localIds = [];
  var page = new Vue({
    el: 'body',
    data: {
      data: {
        people: {},
        lists:[],
      },
      peoples:[],
      selected: {},
      selectedSub: {},
      s_operate: '',
    },
    methods: {
      set_image: function(sub, e, types) {
          if($('.repairpic').length >=6){
              alert('你最多只能选择6张照片！');
              return;
            }
          var num = 6 - $('.repairpic').length;

          wx.chooseImage({
            count: num, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              var localImageID = localIds[0];
              if (types === 'sub') {
                sub.background['background-image'] = 'url(' + localImageID + ')';
              }
              syncUpload();
            },

          });

      },

      savePage: function() {
        $('#saveBtn').attr('disabled', true);
        var len = $('.repairpic').length;
        for(var i=0;i<len;i++){
          var img = $('.repairpic').eq(i).find('img').attr('src');
          page.data.lists.push(img);
        }
        // 转换为服务器格式 很重要！！！不能更改现在在用的数据
        var data = JSON.parse(JSON.stringify(page.data));
        data.openID = openID;
        page.data.openID = openID;
        data.filelink = page.data.lists;

          $.ajax({
            type: 'POST',
            url: baseURL + '/repair',
            data: data,
            success: function(data) {
              // alert(JSON.stringify(data));
                  // 模板消息推送
                  $.ajax({
                  type: 'POST',
                  url: baseURL + '/sendRepair',
                  data: {
                    id:data[0],
                    randcode: data[1],
                    goods:page.data.goods,
                    openID:page.data.openID,
                    nameopenID:page.data.people
                  },
                  success: function(dat) {
                    // alert(JSON.stringify(dat));
                    layer.alert('报修成功!', {icon: 1}, function(){
                        location.href = './repairlist.html?p=' + data.ID + '&u=' + openID;
                    });

                  },
                  error: function(data){
                    layer.alert('模板消息推送失败,请重新申请', {icon: 2});
                  }
                });

            },
            error:function(data){
              var dat = JSON.parse(JSON.stringify(data));
              alert(dat.responseJSON.message);
              // alert(data);
            }
          });

      },

    }
  });

 //图片上传
  function syncUpload() {
      var localId = localIds.pop();
       wx.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            $.ajax({
              type: 'POST',
              url: baseURL + '/downloadImages',
              data: {
                media_id: serverId
              },
              success: function(data) {
                // page.data.lists.push(data.filelink);
                $('.photo').append('<div class="repairpic"><img src="'+data.filelink+'"/><div class="close">×</div></div>');
              },
              error: function(res) {
                alert("下载图片到服务器时出错：" + localImageID + " " + JSON.stringify(res));
              }
            });
            syncUpload();
          },
          error: function(res)
          {
            alert("上传图片到微信时出错：" + localImageID + " " + JSON.stringify(res));
          }
        });
    }

  // 微信JS-SDK
  $.ajax({
    type: 'GET',
    url: baseURL + '/getJSSDK',
    data: {
      url: location.href
    },
    success: function(data) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  });

  //删除图片
  $('.photo').on('click','.close',function(){
    $(this).parent().remove();
  });

});
