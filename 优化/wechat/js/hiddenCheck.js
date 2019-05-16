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

    // 隐患排查
    var index = new Vue({
        el: 'html',
        data: {
            date: null,
            datetime: null,
            content: null,
            lists: [],
            place:null,
        },
        methods:{
            set_image: function () {
                if(index.lists.length >= 5){
                    layer.open({
                        content: '图片上传仅限5张'
                        ,skin: 'msg'
                        ,time: 2
                      });
                    return false;
                }
                // 选择图片或拍照
		        wx.chooseImage({
		          	count: 1, // 默认9
		          	sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		          	sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
		          	success: function(res) {
						//alert(typeof res.localIds);
		          	// 获取当前拍照时间
	                $.ajax({
	                    type: 'GET',
	                    url: baseURL + '/wechattime',
	                    success: function(data) {
	                        index.datetime = data;
	                    }
	                });
		            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
		            var localImageID = localIds[0];
		            // 先用本地图片看一下效果，同时开始上传
		            wx.uploadImage({
		              localId: localImageID, // 需要上传的图片的本地ID，由chooseImage接口获得
		              isShowProgressTips: 1, // 默认为1，显示进度提示
		              success: function(res) {
		                var serverId = res.serverId; // 返回图片的服务器端ID
		                // 再获取本地服务器图片url

		                $.ajax({
		                  type: 'POST',
		                  url: baseURL + '/downloadImages',
		                  data: {
		                    media_id: serverId
		                  },
		                  success: function(data) {
		                  	index.lists.push(data.filelink);
		                  },
		                  error: function(res) {
		                    alert("下载图片到服务器时出错：" + localImageID + " " + JSON.stringify(res));
		                  }
		                });
		              },
		              error: function(res)
		              {
		                alert("上传图片到微信时出错：" + localImageID + " " + JSON.stringify(res));
		              }
		            });
		          }
		        });
            },
            add: function () {
                $('#id-add').attr('disabled',true);
                if(index.lists.length == 0){
                	layer.open({
					    content: '请选择拍照'
					    ,skin: 'msg'
					    ,time: 2
					  });
                	return false;
                }
                // alert(JSON.stringify(index.lists));
                var content = index.content;
                // 保存
                $.ajax({
                    type: "POST",
                    url: baseURL + '/hiddenCheckAdd',
                    data:{place:index.place, u:openID, time:index.datetime, img:index.lists, content,content},
                    success: function(data) {
                        // alert(JSON.stringify(data));
                        // layer.open({
                        //     content: data.message
                        //     ,btn: '确定'
                        //     ,shadeClose: false
                        //     ,yes: function(index){
                        //         location.reload();
                        //     }
                        // });
                        // location.href = './patrol.html?u=' + openID;
                        layer.alert("提交成功！", {icon: 1}, function(){
                            location.href = './patrol.html?u=' + openID;
                        })

                    },
                    error: function(data) {
                        // layer.open({
                        //     content: data.responseJSON.message
                        //     ,btn: '确定'
                        //     ,shadeClose: false
                        //     ,yes: function(index){
                        //         location.reload();
                        //     }
                        // });
                        layer.alert("提交失败！", {icon: 2})
                    },
                });
            }
        },
        ready () {
            // 获取微信JS SDK相关配置
            $.ajax({
                type: 'GET',
                url: baseURL + '/getJSSDK',
                data: {
                    url: location.href
                },
                success: function(data) {
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: ['chooseImage', 'uploadImage']
                    });
                }
            });
            layer.close(index1);
        }
    });
    // 获取当前日期并刷新
    setInterval(function () {
        var date = new Date();
        var year = date.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var day = date.getDate(); //获取当前日(1-31)
        var weekarr = ['天', '一', '二', '三', '四', '五', '六'];
        var week = date.getDay(); //获取当前星期X(0-6,0代表星期天)
        index.date = year + '年' + month + '月' + day + '日' + '星期' + weekarr[week];
    },1000);
});
