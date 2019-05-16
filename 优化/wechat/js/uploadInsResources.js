$(function(){
	var id = args.bId;
  	var zid = args.zId;
  	var jid = args.jId;
  	var localIds = [];

	var uploadResources = new Vue({
	    el:"#uploadResources",
	    data:{
	    	bookLists:null,
			bId:null,
			zId:null,
			jId:null,
			chapterLists:null,
			nodeLists:null,
			res_Url:null,
			areaShare:null,
			schoolNice:null,
	    	img:[],
	    	term:0
	    },
	    methods:{
	          set_image: function () {
	          	if($('.testListBox .bookPic').length>=6){
	          		alert('你最多只能选择6张照片！');
	          		return;
	          	}
	          	var num = 6 - $('.testListBox .bookPic').length;
	            // 选择图片或拍照
	            wx.chooseImage({
	                count: num, // 默认9
	                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
	                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	                success: function(res) {            //alert(typeof res.localIds);
	                localIds = res.localIds;
                    syncUpload();

	              }
	          });
	        },
	        sub:function(){
	        	//上传资源保存到后台
				$("#id-btn").attr("disabled", true)
	        	if (uploadResources.img.length>0) {
                	uploadResources.img = uploadResources.img.join();
                };
                var resName = $('#resName').val();
			 	var bookId = $('#bookId').val();
	            var zhangId = $('#zhangId').val();
	            var jieId = $('#jieId').val();
                //保存数据
                $.ajax({
                  type:"post",
                  url: baseURL + '/saveResourceTeaching',
                  data:{
                    resName:resName,
	                bookId:bookId,
	                zhangId:zhangId,
	                jieId:jieId,
                    resource_url:uploadResources.img,
                    openID:args.u
                  },
                  success:function(data){
	                layer.alert('保存成功',{
	                    icon : 1,
	                },function(){
	                	window.location.href="./insResManager.html?jId="+jid+"&zId="+zid+"&bId="+id+"&u="+args.u;
	                });
                  },
                  error:function(data){
                  	layer.alert(data.responseJSON,{
	                    icon : 2,
	                })

                  }
                })
	        }
	    }
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



    function syncUpload() {
        var localId = localIds.pop();
        wx.uploadImage({
            localId: localId,
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
                    //显示上传图片
                    $('.testListBox').append('<div class="bookPic"><img src="'+data.filelink+'"></div>');
                    uploadResources.img.push(data.filelink);

                  },
                  error: function(res) {
                    alert("下载图片到服务器时出错：" + localImageID + " " + JSON.stringify(res));
                  }
                });
                syncUpload();
            }
        });
    }

	begin();
	function begin(){
		//获取当前学期
        $.ajax({
            type: "GET",
            url: baseURL + '/termNow',
            success: function(response) {
                uploadResources.term = response;
                //课本列表
			    $.ajax({
			        type: "GET",
			        url: baseURL + '/weresTeachingList',
			        data:{openID:args.u,term:uploadResources.term},
			        success: function(data) {
			            uploadResources.bookLists = data.list;
			        	uploadResources.bId = id;
			        },
			        error: function(response) {
			            layer.alert('课本列表加载失败，请重试',{
			                icon : 2,
			            })
			        },
			    });
            },
            error: function(response) {
                layer.alert(response.responseJSON,{
                    icon : 2,
                })
            },
        });

	    //章节列表
	    $.ajax({
	        type: "GET",
	        url: baseURL + '/chapterListForSelect',
	        data:{bId:args.bId},
	        success: function(data) {
	            uploadResources.chapterLists = data.chapter;
	            uploadResources.nodeLists = data.node;
	        	uploadResources.zId = zid;
	        	uploadResources.jId = jid;
	        },
	        error: function(response) {
	            layer.alert('课本列表加载失败，请重试',{
	                icon : 2,
	            })
	        },
	    });
	}
})
