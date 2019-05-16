$(function(){
	var create = new Vue({
		el:"#create",
		data:{lists:null,
			  selectedpPeople:[],
			  user:null
			 },
		methods:{
			//选择企业用户分组
			importEnterpriseTranslate: function(){
		        //加载层
		        index2 = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
		        // 获取
	          	$.getJSON(baseURL + '/importEnterpriseTranslate', function(res){
	              	layer.close(index2);
	                  //页面层
	                  index = layer.open({
	                      type: 1,
	                      area:['250px', '300px'],
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
	                          chkStyle: "checkbox",
	                          chkboxType: { "Y": "s", "N": "s" }
	                      },
	                      data: {
	                          simpleData: {
	                              enable: true
	                          }
	                      },
	                      callback: {
	                          onCheck: zTreeOnCheck1,
	                          onClick: zTreeOnCheck1
	                        }
	                  };

	                  $.fn.zTree.init($("#selectedEnterpriseTree"), setting, res);
	                  var zTree = $.fn.zTree.getZTreeObj("selectedEnterpriseTree");
	                  zTree.expandAll(false);

		        });
		    },
		    //选择本校教师分组
			selectTeacher: function(){
            //加载层
	        index3 = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
	          // 获取
	          $.getJSON(baseURL + '/teacherGroup', function(res){//之前的接口是importTeacherTranslate
	              layer.close(index3);
	              // console.log(res);
	                  //页面层
	                  index = layer.open({
	                      type: 1,
	                      area:['250px', '300px'],
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
	                          chkboxType: { "Y": "s", "N": "s" }
	                      },
	                      data: {
	                          simpleData: {
	                              enable: true
	                          }
	                      },
	                      callback: {
	                          onCheck: zTreeOnCheck,
	                          onClick: zTreeOnCheck
	                        }
	                  };

	                  $.fn.zTree.init($("#selectedTeacherTree"), setting, res);
	                  var zTree = $.fn.zTree.getZTreeObj("selectedTeacherTree");
	                  zTree.expandAll(false);
	          });

	        },
	        submit:function(){
				$('#saveBtn').attr('disabled', true);
	         	var item = create.selectedpPeople;
	         	var name = $('#name').val();
		        var starttime = $("#starttime").val();
		        var endtime = $("#endtime").val();
		        var place = $('#place').val();
		        if(!name || !place || !starttime){
		        	layer.alert('请输入必填项！',{
	                  icon : 5,
	                });
	                return;
		        }
	          	// 创建会议
	             $.ajax({
	              type: "GET",
	              url: baseURL + '/createTranslate',
	              data: {
	                starttime: starttime,
	                endtime: endtime,
	                name: name,
	                place: place,
	                hostname: create.user,
	                item:item
	              },
	              success: function(response) {
					  layer.alert(response.message, { icon: 1},function(){
					      window.location = "./translatelist.html?u="+args.u;
					  });
	              },
	              error: function(response) {
	                layer.alert(response.responseJSON.message,{
	                  icon : 2,
	                })
	              }
	            });
          	}
		}
	})
	//页面初始化
	begin();
	function begin(){
		//会议室列表
	    $.ajax({
	      type:"GET",
	      url:baseURL +'/getLocation',
	      success:function(data){
	        create.lists = data;
	      },
	      error:function(){

	      }
	    });
	    //获取当前用户名
        $.ajax({
	      	type:"GET",
	      	url:baseURL +'/getTeacherName',
	      	data:{openID:args.u},
	      	success:function(data){
	        	create.user = data.name;
	      	},
	      	error:function(){

	      	}
	    });
	}

	//确定企业微信用户
	$("#saveSelectedEnterprise").click(function(){
        var zTree = $.fn.zTree.getZTreeObj("selectedEnterpriseTree");
        var nodes = zTree.getCheckedNodes(true);
        var NodeString = '';
        $.each(nodes, function (n, value) {
           if(value.isParent!=true){
              NodeString+=value.id+",";
            }

        });
        create.selectedpPeople += NodeString;
        layer.close(index);
        $("#selectedEnterprise").css({display:'none'});
    })

	//确定校教师组织
    $("#saveSelectedTeacher").click(function(){
      	var zTree = $.fn.zTree.getZTreeObj("selectedTeacherTree");
	    var nodes = zTree.getCheckedNodes(true);
	    var NodeString = '';
	    $.each(nodes, function (n, value) {
	        if(value.isParent!=true){
	            NodeString+=value.id+",";
	        }

	    });
	    create.selectedpPeople += NodeString;
	    layer.close(index);
	    $("#selectedTeacher").css({display:'none'});
  	});

	//时间插件
    // layui.use(['layer', 'laydate', 'form', 'upload'], function(){
    //     var layer = layui.layer
    //     ,laydate = layui.laydate
    //     ,uploadInst = layui.upload
    //     ,form = layui.form;
    //     var photots = new Array();
    //     //执行一个laydate实例
    //     laydate.render({
    //         elem: '.start'
    //         ,type: 'datetime'
    //         ,format: 'yyyy-M-d HH:mm'
    //     });
    //     laydate.render({
    //         elem: '.end'
    //         ,type: 'datetime'
    //         ,format: 'yyyy-M-d HH:mm'
    //     });
    // });

	$('.start').datePicker({
		beginyear: 2005,
		theme: 'datetime',
	});

	$('.end').datePicker({
		beginyear: 2005,
		theme: 'datetime',
	});
    //本校教师选中
	function zTreeOnCheck(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("selectedTeacherTree");
		zTree.checkNode(treeNode, !treeNode.checked, true);
	}

	//企业微信教师选中
	function zTreeOnCheck1(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("selectedEnterpriseTree");
		zTree.checkNode(treeNode, !treeNode.checked, true);
	}

})
