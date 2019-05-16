$(function() {
	var src = window.location.href;
	var first = src.indexOf('&ids=');
	var ids = src.substr(first + 5);
	var width = $('.evaluation-one').width();
	var wid = width + 'px';
	$('.evaluation-two').css({
		left: wid
	});
	intPage();
	// var accordion = new Vue({
	// 	el:"#accordion",
	// 	data:{
	// 		// people:null,
	// 		// project:null,
	// 	},
	// 	methods:{

	// 	}
	// });

	var accordion1 = new Vue({
		el: "#evaluation",
		data: {
			people: null,
			project: null,
			temp: null,
			open: true,
			memo: '',
			img: []
		},
		methods: {
			chooseThis: function(pId, sId) {
				$('#eva' + pId + ' >.falsevatype').addClass('evatype');
				// $('#eva'+pId+' >.evatype').removeClass('falsevatype');
				var ss = '#son_' + sId;
				if ($(ss).hasClass('falsevatype')) {
					$(ss).removeClass('falsevatype');
				} else {
					$(ss).removeClass('evatype');
					$(ss).addClass('falsevatype');
				}
				var tmp = [];
				$('.falsevatype').each(function() {
					if ($(this).attr('sId') > 0) {
						tmp.push($(this).attr('sId'));
					}
				});
				accordion1.temp = tmp;

			},
			toggleOpen: function() {
				accordion1.open = !accordion1.open;
			},
			saveEvalution: function() {
				$("#submit").attr("disabled", true)
				var len = $('.up-imgs .up-imgs-box').length;
				if(len > 0){
					for (var i = 0; i < len; i++) {
						var img = $('.up-imgs .up-imgs-box').eq(i).find('img').attr('src');
						accordion1.img.push(img);
					}
               	    accordion1.img = accordion1.img.join();
				}
				var openID = args.u;
				var organizeID = args.ID != undefined ? args.ID : null;
				$('#submit').attr('disabled', true);
				if (accordion1.open == true) {
					var open = 0;
				} else {
					var open = 1;
				}
				$.ajax({
					type: 'POST',
					url: baseURL + '/evalutionSave',
					data: {
						params: accordion1.temp,
						allPeople: ids,
						openID: openID,
						organizeID: organizeID,
						memo: accordion1.memo,
						access: open,
						img:accordion1.img
					},
					success: function(data) {
						layer.alert("评价成功！", {icon: 1}, function(){
							window.location.href = './mien.html?u=' + args.u;
						});
					},
					error: function(data) {
						$('#submit').attr('disabled', false);
						// layer.close(layer.index);
					},
				});
			},
			showTo: function() {
				$('.evaluation-one').animate({
					left: (-width) + 'px'
				});
				$('.evaluation-two').animate({
					left: 0
				});
				$('.btn').css({
					display: 'none'
				});
				$('.two-btn').css({
					display: 'block'
				});
			},
			hideTo: function() {
				$('.evaluation-one').animate({
					left: 0
				});
				$('.evaluation-two').animate({
					left: width + 'px'
				});
				$('.btn').css({
					display: 'block'
				});
				$('.two-btn').css({
					display: 'none'
				});
			},
			set_image: function() {
				if ($('.up-imgs .up-imgs-box').length >= 6) {
					alert('你最多只能选择6张照片！');
					return;
				}
				var num = 6 - $('.up-imgs .up-imgs-box').length;
				wx.chooseImage({
					count: num, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						syncUpload();
					},

				});
			},
		}
	});
	$('.collapse').collapse();
	$('.arrow').click(function() {
		$('.namelist').toggle();
	})


	$('.typelist').click(function() {
		if ($(this).find('i').attr('class') == 'layui-icon layui-icon-right') {
			$(this).find('i').removeClass('layui-icon-right').addClass('layui-icon-down');
		} else {
			$(this).find('i').addClass('layui-icon-right').removeClass('layui-icon-down');

		}
	})

	function intPage() {
		var organizeID = args.ID != undefined ? args.ID : null;
		//获取选中的学生列表和待点评列表
		$.ajax({
			type: 'GET',
			url: baseURL + '/studentAndOptions',
			data: {
				choosed: ids,
				organizeID: organizeID,
			},
			success: function(data) {
				var tmp = data.project;
				for (var i = 0; i < tmp.length; i++) {
					for (var a = 0; a < tmp[i]['gradeItem'].length; a++) {
						if (tmp[i]['gradeItem'][a] && tmp[i]['gradeItem'][a].logo) {
							tmp[i]['gradeItem'][a].pic = tmp[i]['gradeItem'][a].logo;
						}
					}
				}

				accordion1.people = data.people;
				accordion1.project = tmp;
			},
			error: function() {
				alert('加载列表失败！')
			}
		});
	}
})
//图片上传
function syncUpload() {
	var localId = localIds.pop();
	wx.uploadImage({
		localId: localId,
		success: function(res) {
			var serverId = res.serverId; // 返回图片的服务器端ID
			// 再获取本地服务器图片url
			$.ajax({
				type: 'POST',
				url: baseURL + '/downloadImages1',
				data: {
					media_id: serverId
				},
				success: function(data) {
					$('.up-imgs').append('<div class="up-imgs-box"><img src="' + baseURL + '/public' + data.filelink + '"><div class="close">×</div></div>');
				},
				error: function(res) {
					alert("下载图片到服务器时出错：" + localImageID + " " + JSON.stringify(res));
				}
			});
			syncUpload();
		}
	});
}
//动态生成的图片绑定事件方法
$(".up-imgs").on("click", ".close", function() {
	var index = confirm("确定要删除这张图片");
	if (index == true) {
		$(this).parent().remove();
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
