var addmien = new Vue({
  el: '#addmien',
  data: {
    mien_type: ''
  },
  methods: {
    set_image: function (sub, e, types) {
      if ($('.picBox .shareImg').length >= 6) {
        alert('你最多只能选择6张照片！');
        return;
      }
      var num = 6 - $('.picBox .shareImg').length;
      wx.chooseImage({
        count: num, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

          syncUpload();
        },

      });
    },
    addnews: function () {
      // 获取表单数据
      $('#btn').attr('disabled',true);
      var img = [];
      var imglen = $('.picBox .shareImg').length;
      for (var i = 0; i < imglen; i++) {
        var src = $('.picBox .shareImg').eq(i).find('img').attr('src');
        img.push(src);
      }
      // 图片地址转换成字符串类型保存
      img = img.join(',');
      var uid = args.u;
      var title = $("#title").val();
      var activetime = $("#time").val();
      var content = $("#con").val();
      var mien_type = args.name;
      var logo = args.logo;
      var type = args.type;
      var ids = args.ids;
      if (!activetime || !content) {
        alert('请填必须内容！');
        return;
      }
      $.ajax({
        type: "POST",
        url: baseURL + '/teachermien/teachermienadd',
        data: {
          title: title,
          u: uid,
          mien_type: mien_type,
          content: content,
          activetime: activetime,
          logo: logo,
          type: type,
          img: img,
          ids: ids
        },
        success: function (data) {
            layer.alert('添加成功',{icon:1}, function(){
                location.href = './mienList.html?u=' + args.u + '&show=1';
            })
        },
        error: function (response) {
          layer.alert('添加失败,请重试',{icon:2});
        },
      });
    },
  },
})

//获取风采名称
addmien.mien_type = args.name;

// 清空提示内容
var one = 0;
$('#con').click(function () {
  if (one == 0) {
    $('#con').html('');
  }
  one++;
})

function syncUpload() {
  var localId = localIds.pop();
  wx.uploadImage({
    localId: localId,
    success: function (res) {
      var serverId = res.serverId; // 返回图片的服务器端ID
      // 再获取本地服务器图片url
      $.ajax({
        type: 'POST',
        url: baseURL + '/downloadImages1',
        data: {
          media_id: serverId
        },
        success: function (data) {
          $('.picBox').append('<div class="shareImg"><img src="' + baseURL + '/public' + data.filelink + '"><div class="close">×</div></div>')
        },
        error: function (res) {
          alert("下载图片到服务器时出错：" + localImageID + " " + JSON.stringify(res));
        }
      });
      syncUpload();
    }
  });
}

//动态生成的图片绑定事件方法
$(".picBox").on("click", "img", function () {
  var index = confirm("确定要删除这张图片");
  if (index == true) {
    $(this).parent().remove();
  }

})

//删除图片
$(".picBox").on('click', '.close', function () {
  $(this).parent().remove();
});

//失败提示弹窗
function opeFail(text, num) {
  layui.use('layer', function () {
    var layer = layui.layer;
    layer.alert(text, {
      icon: num
    });
  });
}

// 微信JS-SDK
$.ajax({
  type: 'GET',
  url: baseURL + '/getJSSDK',
  data: {
    url: location.href
  },
  success: function (data) {
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
