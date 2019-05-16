$(function(){
	var localIds = [];
	var lost = new Vue({
		el:"#lost",
		data:{
			nowtime:null
		},
		methods:{
			sub:function(){
				$('#id-sub').attr('disabled',true);
			  var img = [];
        var imglen = $('.picBox .shareImg').length;
        for(var i=0;i<imglen;i++){
          var src = $('.picBox .shareImg').eq(i).find('img').attr('src');
          img.push(src);
        }

        // 提交的数据
        var time = $('#time').val();
        var thing = $('#thing').val();
        var lostplace = $('#lostplace').val();
        var getplace = $('#getplace').val();
        // 图片地址转换成字符串类型保存
        img = img.join(',');
        // if (!thing) {
        //   alert('请填写物品名称！');return;
        // }
        // if (!lostplace) {
        //   alert('请填写捡物地点！');return;
        // }
        // if (!getplace) {
        //   alert('请填写领取地点！');return;
        // }
        $.ajax({
          type: "POST",
          url: baseURL + '/lost',
          data:{name:thing,
                pickPlace:lostplace,
                receivePlace:getplace,
                img:img,
                publishDate:time,
                openID:args.u
              },
          success: function(data) {
            layer.alert('保存成功！',{
              icon : 1,
            },function(){
               window.location.href = "./lost_list.html?u="+args.u;
            })

          },
          error: function(response) {
            layer.alert('失败,请重试',{
              icon : 2,
            })
          },
        });

			},
			set_image: function(sub, e, types) {
        if($('.picBox .shareImg').length>=6){
          alert('你最多只能选择6张照片！');
          return;
        }
        var num = 6 - $('.picBox .shareImg').length;
        wx.chooseImage({
              count: num, // 默认9
              sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function(res) {            //alert(typeof res.localIds);
              localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              syncUpload();
            }
        });
      },
		}
	})

  // 获取当前时间
  $.ajax({
    type: 'GET',
    url: baseURL + '/wechattime',
    success: function(data) {
      lost.nowtime=data;
    }
  });

  //图片上传
  function syncUpload() {
    var localId = localIds.pop();
    wx.uploadImage({
        localId: localId,
        success: function(res) {
            var serverId = res.serverId;
            $.ajax({
              type: 'POST',
                url: baseURL + '/downloadImages1',
                data: {
                  media_id: serverId
                },
                success: function(data) {
                    $('.picBox').append('<div class="shareImg"><img src="'+ baseURL +'/public'+ data.filelink +'"><div class="close">×</div></div>')
                },
                error: function(res) {
                  alert("下载图片到服务器时出错：" + localImageID + " " + JSON.stringify(res));
                }
            });
          syncUpload();
        }
    });
  }

  //删除上传图片
  $('.picBox').on('click','.close',function(){
    $(this).parent().remove();
  })

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

})
