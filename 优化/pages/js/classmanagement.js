$(function(){
	var classmanagement = new Vue({
		el:"#classmanagement",
		data:{
			auth:null,
            classroomInfo:[],
            classroomLists: null,
            placeLists: null
		},
		methods:{
			//删除地点
			delPlace:function(id){
				layer.confirm("确定删除？", {fixed: false, shade: false}, function(){
					$.ajax({
			   			type:"POST",
	                    url:baseURL + '/placeDel',
			   			data:{id,id},
			   			success:function(){
	                        layui.use('layer',function(){
	                            var layer = layui.layer;
	                            layer.alert("删除地点成功！",{icon:6,shade: 0,fixed:false})
	                        });
	                        begin();
			   			},
			   			error:function(){
	                        layer.alert('删除失败,请重试',{
	                            icon : 2,
	                        })
			   			}
			   		});
				})
			},
			edit:function(id){
                $.ajax({
                    type: 'GET',
                    url:baseURL + '/classroomEdit',
                    data:{id:id},
                    success: function(data){
                        classmanagement.classroomInfo = data;
                    }
                });
				ope("编辑",'#edit');
			},
			editSub:function(){
                var id = $('#classroomId').val();
				var roomName = $('#editname').val();
		   		var type = $('#edittype').val();
		   		var placeId = $('#editplace').val();
		   		$.ajax({
		   			type:"POST",
                    url:baseURL + '/classroomEditSave',
		   			data:{id:id,roomName:roomName,type:type,placeId:placeId},
		   			success:function(){
                        layui.use('layer',function(){
                            var layer = layui.layer;
                            layer.alert("修改成功！",{icon:6,shade: 0,fixed:false},function(){
                            	layer.closeAll(); //再执行关闭
                                begin();
                            })
                        });

		   			},
		   			error:function(){
                        layer.alert('修改失败,请重试',{
                            icon : 2,
                        })
		   			}
		   		});
			},
			delete:function(id){
				layer.confirm("确定删除？", {fixed: false, shade: false}, function(){
					$.ajax({
			   			type:"POST",
	                    url:baseURL + '/classroomDel',
			   			data:{id,id},
			   			success:function(){
	                        layui.use('layer',function(){
	                            var layer = layui.layer;
	                            layer.alert("删除教室成功！",{icon:6,shade: 0,fixed:false})
	                        });
	                        begin();
			   			},
			   			error:function(){
	                        layer.alert('删除失败,请重试',{
	                            icon : 2,
	                        })
			   			}
			   		});
				})
			},
			addplace:function(){
				ope("添加地点",'#place');
			},
			addclass:function(){
				ope("添加专用教室",'#class');
			},
			placeSub:function(){
				var place = $('#addPlace').val();
				//提交添加地址
				$.ajax({
		   			type:"POST",
		   			url:baseURL + '/placeAdd',
		   			data:{
		   				place:place
		   			},
		   			success:function(data){
                        layui.use('layer',function(){
                            var layer = layui.layer;
                            layer.alert("添加地点成功！",{icon:6,shade: 0,fixed:false})
                        });
		   				begin();
		   				layer.closeAll('page');
		   			},
		   			error:function(){
		   				layer.alert('添加地点失败,请重试',{
		                    icon : 2,
		                })
		   			}
		   		});
			},
			sub:function(){
				var type = $('#type').val();
		   		var roomName = $('#roomName').val();
		   		var placeId = $('#placeId').val();
		   		$.ajax({
		   			type:"POST",
                    url:baseURL + '/classroomAdd',
                    data:{roomName:roomName,type:type,placeId:placeId},
		   			success:function(){
                        layui.use('layer',function(){
                            var layer = layui.layer;
                            layer.alert("添加专用教室成功！",{icon:6,shade: 0,fixed:false})
                        });
                        begin();
                        layer.closeAll('page');
		   			},
		   			error:function(){
                        layer.alert('添加专用教室失败,请重试',{
                            icon : 2,
                        })
		   			}
		   		});
			}
		},
	});
	//检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"classmanagement/edit"},
          success: function(data) {
              classmanagement.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

   //初始化教室管理
   begin();
   function begin(){
   		$.ajax({
   			type:"GET",
   			url:baseURL + '/classroomShow',
   			data:{},
   			success:function(data){
                classmanagement.placeLists = data.placeLists;
   				classmanagement.classroomLists = data.classroomLists;

   			},
   			error:function(){
                layer.alert('初始化教室管理失败！',{
                  icon : 2,
                })
   			}
   		});
   }

   //弹窗
   function ope(title,obj){
   		layui.use('layer',function(){
			var layer = layui.layer;
		    layer.open({
			  type: 1,
			  title:title,
			  area: ['390px', '360px'],
			  content: $(obj),
			  shadeClose: true,
              shade: false,
			  fixed:false,
			  end: function(index, layero){
				   $(obj).css({display:"none"});
				},
			});
		});
   }
});
