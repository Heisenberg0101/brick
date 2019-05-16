$(function(){
	// 创建会议
  	var translate = new Vue({
    el: "#createtranslate",
    data: {
      lists:null,
      currentFunction: null,
      data: {
        user:null
      },
      selectedpPeople:[]
    },

    methods: {
        importEnterpriseTranslate: function(){
          //加载层
        index2 = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
          // 获取
          $.getJSON(baseURL + '/importEnterpriseTranslate', function(res){
              layer.close(index2);
              // console.log(res)
                  //页面层
                  index = layer.open({
                      type: 1,
                      area:['350px', '400px'],
                      title:'选择企业用户分组',
                      skin: 'layui-layer-demo', //加上边框
                      content: $('#selectedEnterprise'),
                      end:function(){
                        $('#selectedEnterprise').css('display','none');
                      }
                  });

                  //设置zetree
                  var setting = {
                      check:{
                          enable:true,
                          showLine: true,
                          chkStyle: "checkbox",
                          chkboxType: { "Y": "s", "N": "s" }
                      },
                      data: {
                          simpleData: {
                              enable: true
                          }
                      }
                  };

                  $.fn.zTree.init($("#selectedEnterpriseTree"), setting, res);
                  var zTree = $.fn.zTree.getZTreeObj("selectedEnterpriseTree");
                  zTree.expandAll(false);

          });
        },
        selectTeacher: function(){
            //加载层
        index3 = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
          // 获取
          $.getJSON(baseURL + '/teacherGroup', function(res){//之前的接口是importTeacherTranslate
              layer.close(index3);
              console.log(res);
                  //页面层
                  index = layer.open({
                      type: 1,
                      area:['350px', '400px'],
                      title:'选择本校教师分组',
                      skin: 'layui-layer-demo', //加上边框
                      content: $('#selectedTeacher'),
                      end:function(){
                        $('#selectedTeacher').css('display','none');
                      }
                  });

                  //设置zetree
                  var setting = {
                      check:{
                          enable:true,
                          chkStyle: "checkbox",
                          checked:true,
                          showLine: true,
                          chkboxType: { "Y": "s", "N": "s" }
                      },
                      data: {
                          simpleData: {
                              enable: true
                          }
                      }
                  };

                  $.fn.zTree.init($("#selectedTeacherTree"), setting, res);
                  var zTree = $.fn.zTree.getZTreeObj("selectedTeacherTree");
                  zTree.expandAll(false);
          });

        },
        submit:function(){
          // xsc
          // var hostnames = getCookie('username');
          // xsc
          var item = translate.selectedpPeople;
          translate.data.starttime = $(".start").val();
          translate.data.endtime = $(".end").val();
          var place = $('#place').val();
          // console.log(item)
          // 创建会议
             $.ajax({
              type: "GET",
              url: baseURL + '/createTranslate',
              data: {
                starttime: translate.data.starttime,
                endtime: translate.data.endtime,
                name: translate.data.name,
                // place: translate.data.place,
                place: place,
                hostname: translate.user,
                item:item

              },
              success: function(response) {
                layer.msg(response.message, {icon: 1});
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
                translate.currentFunction = null;
                translatelist.currentFunction = '会议列表';
                getTranslateList();
                // alert(JSON.stringify(translatelist.currentFunction));
              },
              error: function(response) {
                layer.alert(response.responseJSON.message,{
                  icon : 5,
                })
              }
            });
          }

    }
  });
    //获取当前用户
    $.ajax({
      type: "GET",
      url: baseURL + '/isUserLogin',
      success: function(result) {
            //用户名
            translate.user = result.user;
            return false;
      },
      error:function(){

      }
      })

  // 会议室列表
    $.ajax({
      type:"GET",
      url:baseURL +'/getLocation',
      success:function(data){
        translate.lists = data;
      },
      error:function(){

      }
    });

$("#addmeeting").click(function(){
 onLoadTimeChoiceDemo();
   borainTimeChoice({
      start:".start",
      end:".end",
      level:"HM",
      less:true
  });
	layui.use('layer',function(){
		var layer = layui.layer;
		layer.open({
		      type: 2,
          area:['800px', '620px'],
          title:'创建会议',
          skin: 'layui-layer-demo', //加上边框
          content: 'createConference.html'
		});
	});
});
  	// 会议列表  会议详情
  	var translatelist = new Vue({
    el: "#translatelist",
    data: {
      currentFunction: null,
      lists: [],
      data: {},
      absenses:[],
      view:{},
      people:[],
      peoples:[],
      signpeople:[],
      signedpeople:[],
      state:null,
      auth:null,
      time:[]

    },

    methods: {
        selectMeet: function(str){
         // alert(JSON.stringify(str));
             // 获取参会人员
            $.ajax({
              type: "GET",
              url: baseURL + '/getTranslatePeople/'+str.id,
              success: function(response) {
                  translatelist.people = [];
                  translatelist.signpeople = [];
                  translatelist.signedpeople = [];
                  translatelist.people=response;
                  for(var i= 0;i< response.length;i++){
                      if(response[i].status == 0){
                        translatelist.signpeople.push(response[i].people);
                   }else if(response[i].status == 1){
                        translatelist.signedpeople.push(response[i].people);
                   }
                }
                  //alert(JSON.stringify(translatelist.signpeople));
                  //alert(JSON.stringify(translatelist.signedpeople));
                  layui.use('layer',function(){
                  var layer = layui.layer;
                  var index=layer.open({
                        closeBtn:0,
                        type: 1,
                        area:['800px', '550px'],
                        title:'参会人员',
                        skin: 'layui-layer-demo', //加上边框
                        content: $('#participants'),
                        btn: ['关闭'],
                        yes: function(index, layero){
                          layer.close(index);
                          $('#participants').css({display:'none'});
                      }
                  });
                });
              },
              error: function(response) {
                layer.alert('无法加载参会人员',{
                  icon : 5,
                })
              }
            });
          },
           selectMeet1: function(str){
             // 获取参会人员
            $.ajax({
              type: "GET",
              url: baseURL + '/getTranslatePeople/'+str.id,
              success: function(response) {
                //alert(JSON.stringify(response));
                  translatelist.people = [];
                  translatelist.signpeople = [];
                  translatelist.signedpeople = [];
                  translatelist.time = [];
                  translatelist.people=response;
                  for(var i= 0;i< response.length;i++){
                      if(response[i].status == 0){
                        translatelist.signpeople.push(response[i].people);
                   }else if(response[i].status == 1){
                        translatelist.signedpeople.push(response[i].people);
                        translatelist.time.push(response[i].signtime);
                   }
                }
           // alert(JSON.stringify(translatelist.time));
                layui.use('layer',function(){
                  var layer = layui.layer;
                  var index1=layer.open({
                        closeBtn:0,
                        type: 1,
                        area:['800px', '550px'],
                        title:'考勤详情',
                        skin: 'layui-layer-demo', //加上边框
                        content: $('#meetingpeoples'),
                        btn: ['关闭'],
                        yes: function(index, layero){
                          layer.close(index1);
                          $('#meetingpeoples').css({display:'none'});
                      }
                  });
                });

              },
              error: function(response) {
                layer.alert('无法加载参会人员',{
                  icon : 5,
                })
              }
            });
          },
        delmeet: function(list){
           // 获取参会人员
            $.ajax({
              type: "GET",
              url: baseURL + '/getTranslatePeople/'+list.id,
              success: function(response) {
                  //alert(JSON.stringify(response));
                  translatelist.peoples = [];
                  for(var i= 0;i< response.length;i++){
                     translatelist.peoples.push(response[i].people);
                 }
                 delmeet(list.id,translatelist.peoples,list);
              },
              error: function(response) {
                layer.alert('无法加载参会人员',{
                  icon : 5,
                })
              }
            });

        },
        //删除会议
        delete:function(id){
            layer.confirm("确定删除？", function(){
                $.ajax({
                  type: "GET",
                  url: baseURL + '/delTranslate/'+id,
                  success: function(response) {
                    layer.alert('删除成功', {icon: 1});
                    getTranslateList();
                  },
                  error: function(response) {
                    layer.alert('操作失败，请检查服务器端',{
                      icon : 5,
                    })
                  }
                });
            })
        },
        // createCode:function(list){
        //  layui.use('layer',function(){
        //       var layer = layui.layer;
        //       layer.open({
        //             type: 2,
        //             area:['800px', '550px'],
        //             title:'会议二维码',
        //             skin: 'layui-layer-demo', //加上边框
        //             content: './signcode.html?p=' + list.id + '&u=' + list.meetname,
        //       });
        //     });
        // },
        sendMeet:function(list){
               // 获取参会人员
            $.ajax({
              type: "GET",
              url: baseURL + '/getTranslatePeople/'+list.id,
              success: function(response) {
                  //alert(JSON.stringify(response));
                  translatelist.peoples = [];
                  for(var i= 0;i< response.length;i++){
                     translatelist.peoples.push(response[i].people);
                 }
                 sendMeet(list.id,translatelist.peoples,list);
              },
              error: function(response) {
                layer.alert('无法加载参会人员',{
                  icon : 5,
                })
              }
            });
        }

    }

  });

//获取会议列表
getTranslateList();
     // 获取会议列表
function getTranslateList() {
    $.ajax({
        type: "GET",
        url: baseURL + '/getTranslateList',
        success: function(response) {
         //alert(JSON.stringify(response));
          for(var i=0;i<response.length;i++){
            if(response[i].state == 0){
                response[i].state  = '未开始';
             }else if(response[i].state == 1){
                response[i].state  = '已过期';
             }
          }
        translatelist.lists = response;
        },
        error: function(response) {
          layer.alert('无法加载会议列表',{
            icon : 5,
          })
        }
    });
};

  //检查权限
  authCheck();
  function authCheck(){
    $.ajax({
        type: "GET",
        url: baseURL + '/authCheck',
        data:{action:"conferenceList/edit"},
        success: function(data) {
            translatelist.auth = data.auth;
        },
        error: function(response) {
            layer.alert('失败,请重试',{
                icon : 2,
            })
        },
    });
  }
  // xsc

  function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

    return unescape(arr[2]);
    else
    return null;
  }

  // xsc

function sendMeet(id,peoples,list){
   // 会议签到消息模板
       $.ajax({
          type: "GET",
          url: baseURL + '/sendMeetNotice/'+id,
          data:{
            people:peoples,
            view:list
          },
          success: function(response) {
            layer.msg('发送会议成功', {icon: 1});
          },
          error: function(response) {
            layer.alert('发送会议通知失败',{
              icon : 5,
            })
          }

      });
}
function delmeet(id,peoples,list){
        $.ajax({
        type: "GET",
        url: baseURL + '/delTranslate/'+id,
        success: function(response) {
          // 取消会议消息模板
          $.ajax({
            type: "GET",
            url: baseURL + '/delMeetNotice/'+id,
            data:{
              people:peoples,
              view:list
            },
            success: function(response) {
               // alert(JSON.stringify(response));
            },
            error: function(response) {
              layer.alert('发送会议通知失败',{
                icon : 5,
              })
            }

         });
          layer.msg('会议已取消', {icon: 1});
          getTranslateList();
        },
        error: function(response) {
          layer.alert('操作失败，请检查服务器端',{
            icon : 5,
          })
        }

    });
}
    $("#saveSelectedEnterprise").click(function(){
          var zTree = $.fn.zTree.getZTreeObj("selectedEnterpriseTree");
          var nodes = zTree.getCheckedNodes(true);
          var NodeString = '';
          $.each(nodes, function (n, value) {
           if(value.isParent!=true){
              NodeString+=value.id+",";
               // if(n>0){
               //      NodeString += ',';
               //  }
               //  NodeString += value.name;
            }

          });
          translate.selectedpPeople += NodeString;
          // console.log(translate.selectedpPeople)
          layer.close(index);
          $("#selectedEnterprise").css({display:'none'});
      })

    $("#saveSelectedTeacher").click(function(){
          var zTree = $.fn.zTree.getZTreeObj("selectedTeacherTree");
          var nodes = zTree.getCheckedNodes(true);
          var NodeString = '';
          $.each(nodes, function (n, value) {
            if(value.isParent!=true){
                NodeString+=value.id+",";
            }

          });
          translate.selectedpPeople += NodeString;
          // console.log(translate.selectedpPeople)
          layer.close(index);
          $("#selectedTeacher").css({display:'none'});
      });

  $('.logo li').click(function(){
      $('li').removeClass('active');
      $(this).addClass('active');
      if($(this).index() == 0){
        $('.sign').css({display:'block'});
        $('.signed').css({display:'none'});
      }else{
        $('.sign').css({display:"none"});
        $('.signed').css({display:"block"});
      }

  });

  // 选择本校教师全部选中
  $("#checkAllTrue").bind("click", { type: "checkAllTrue" }, checkNode);
  $("#checkAllFalse").bind("click", { type: "checkAllFalse" }, checkNode);
   function checkNode(e) {
        var zTree = $.fn.zTree.getZTreeObj("selectedTeacherTree"),
                type = e.data.type,
                nodes = zTree.getSelectedNodes();
        console.log(type.indexOf("All"));
        if (type.indexOf("All") < 0 && nodes.length == 0) {
            alert("请先选择一个节点");
        }
        if (type == "checkAllTrue") {
            zTree.checkAllNodes(true);
        } else if (type == "checkAllFalse") {
            zTree.checkAllNodes(false);
        }
    }

    // 选择企业微信教师全部选中
  $("#checkAllTrue1").bind("click", { type: "checkAllTrue" }, checkNode1);
  $("#checkAllFalse1").bind("click", { type: "checkAllFalse" }, checkNode1);
   function checkNode1(e) {
        var zTree = $.fn.zTree.getZTreeObj("selectedEnterpriseTree"),
                type = e.data.type,
                nodes = zTree.getSelectedNodes();
        console.log(type.indexOf("All"));
        if (type.indexOf("All") < 0 && nodes.length == 0) {
            alert("请先选择一个节点");
        }
        if (type == "checkAllTrue") {
            zTree.checkAllNodes(true);
        } else if (type == "checkAllFalse") {
            zTree.checkAllNodes(false);
        }
    }

})
